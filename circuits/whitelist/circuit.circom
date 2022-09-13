pragma circom 2.0.3;

include "../../node_modules/circomlib/circuits/mimcsponge.circom";

template Whitelist() {
  // Public signals
  signal input recipient;

  // Private signals
  signal input key;

  signal output hash;

  component hasher = MiMCSponge(1, 220, 1);
  hasher.ins[0] <== key;
  hasher.k <== 0;
  hash <== hasher.outs[0];

  // Include the recipient in the circuit
  // so tampering with it invalidates the SNARK
  signal recipientSquared;
  recipientSquared <== recipient * recipient;
}

component main { public [ recipient ] } = Whitelist();
