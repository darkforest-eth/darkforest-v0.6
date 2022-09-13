import camelcase from 'camelcase';
import * as fs from 'fs/promises';
import { TASK_CIRCOM_TEMPLATE, ZkeyFastFile } from 'hardhat-circom';
import { subtask } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import * as path from 'path';
import { resolvePackageDir } from '../settings';

subtask(TASK_CIRCOM_TEMPLATE, 'replace hardhat-circom templating with custom').setAction(
  circomTemplate
);

async function circomTemplate(
  { zkeys }: { zkeys: ZkeyFastFile[] },
  hre: HardhatRuntimeEnvironment
) {
  // The circom task can be run with `--circuit circuitName`, and we don't want to change
  // the template if someone is trying to compile one circuit because that would remove
  // all the other verifyProof functions
  if (zkeys.length !== hre.config.circom.circuits.length) {
    throw new Error('Unable to generate circom template without all zkeys');
  }

  let finalSol = '';
  for (const zkey of zkeys) {
    const name = camelcase(zkey.name, {
      pascalCase: true,
      preserveConsecutiveUppercase: true,
      locale: false,
    });
    const verifyingKeyName = `${name}VerifyingKey`;
    const verifyProofName = `verify${name}Proof`;
    const groth16 = `
    function ${verifyingKeyName}() internal pure returns (VerifyingKey memory vk) {
        vk.alfa1 = Pairing.G1Point(
            <%=vk_alpha_1[0]%>,
            <%=vk_alpha_1[1]%>
        );

        vk.beta2 = Pairing.G2Point(
            [<%=vk_beta_2[0][1]%>,
            <%=vk_beta_2[0][0]%>],
            [<%=vk_beta_2[1][1]%>,
            <%=vk_beta_2[1][0]%>]
        );
        vk.gamma2 = Pairing.G2Point(
            [<%=vk_gamma_2[0][1]%>,
            <%=vk_gamma_2[0][0]%>],
            [<%=vk_gamma_2[1][1]%>,
            <%=vk_gamma_2[1][0]%>]
        );
        vk.delta2 = Pairing.G2Point(
            [<%=vk_delta_2[0][1]%>,
            <%=vk_delta_2[0][0]%>],
            [<%=vk_delta_2[1][1]%>,
            <%=vk_delta_2[1][0]%>]
        );
        vk.IC = new Pairing.G1Point[](<%=IC.length%>);
        <% for (let i=0; i<IC.length; i++) { %>
        vk.IC[<%=i%>] = Pairing.G1Point(
            <%=IC[i][0]%>,
            <%=IC[i][1]%>
        );
        <% } %>
    }
    /// @return r  bool true if proof is valid
    function ${verifyProofName}(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[<%=IC.length-1%>] memory input
    ) public view returns (bool) {
        Proof memory proof;
        proof.A = Pairing.G1Point(a[0], a[1]);
        proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.C = Pairing.G1Point(c[0], c[1]);

        VerifyingKey memory vk = ${verifyingKeyName}();
        uint256[] memory inputValues = new uint256[](input.length);
        for (uint256 i = 0; i < input.length; i++) {
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof, vk) == 0) {
            return true;
        } else {
            return false;
        }
    }
    `;

    const circuitSol = await hre.snarkjs.zKey.exportSolidityVerifier(
      zkey,
      // We don't want to support plonk currently
      { groth16, plonk: '' }
    );

    finalSol = finalSol.concat(circuitSol);
  }

  const circuitsWorkspace = resolvePackageDir('circuits');
  const verifierTemplatePath = path.join(circuitsWorkspace, 'Verifier.sol.template');
  const verifier = path.join(hre.config.paths.sources, `facets/DFVerifierFacet.sol`);

  const template = await fs.readFile(verifierTemplatePath, 'utf8');

  await fs.mkdir(path.dirname(verifier), { recursive: true });

  await fs.writeFile(verifier, template.replace(/<%full_circuit%>/g, finalSol));
}
