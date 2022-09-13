import * as decoders from 'decoders';

export function between(decoder: decoders.Decoder<number>, min: number, max: number) {
  return decoders.compose(
    decoder,
    decoders.predicate((val) => val >= min && val <= max, `Must be between ${min} and ${max}`)
  );
}

export type ExactArray4<A> = [A, A, A, A];

export function exactArray4<A>(decoder: decoders.Decoder<A>) {
  return decoders.map(
    decoders.compose(
      decoders.array(decoder),
      decoders.predicate((arr) => arr.length === 4, `Must be exactly 4-length`)
    ),
    (value) => [value[0], value[1], value[2], value[3]] as ExactArray4<A>
  );
}

export type ExactArray5<A> = [A, A, A, A, A];

export function exactArray5<A>(decoder: decoders.Decoder<A>) {
  return decoders.map(
    decoders.compose(
      decoders.array(decoder),
      decoders.predicate((arr) => arr.length === 5, `Must be exactly 5-length`)
    ),
    (value) => [value[0], value[1], value[2], value[3], value[4]] as ExactArray5<A>
  );
}

export type Tuple6<A> = [A, A, A, A, A, A];

export function array6<A>(decoder: decoders.Decoder<A>) {
  return decoders.map(
    decoders.compose(
      decoders.array(decoder),
      decoders.predicate((arr) => arr.length === 6, `Must be exactly 6-length`)
    ),
    (value) => [value[0], value[1], value[2], value[3], value[4], value[5]] as Tuple6<A>
  );
}

export type ExactArray10<A> = [A, A, A, A, A, A, A, A, A, A];

export function exactArray10<A>(decoder: decoders.Decoder<A>) {
  return decoders.map(
    decoders.compose(
      decoders.array(decoder),
      decoders.predicate((arr) => arr.length === 10, `Must be exactly 10-length`)
    ),
    (value) =>
      [
        value[0],
        value[1],
        value[2],
        value[3],
        value[4],
        value[5],
        value[6],
        value[7],
        value[8],
        value[9],
      ] as ExactArray10<A>
  );
}

export type ExactArray64<A> = [
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A,
  A
];

export function exactArray64<A>(decoder: decoders.Decoder<A>) {
  return decoders.map(
    decoders.compose(
      decoders.array(decoder),
      decoders.predicate((arr) => arr.length === 64, `Must be exactly 64-length`)
    ),
    (value) =>
      [
        value[0],
        value[1],
        value[2],
        value[3],
        value[4],
        value[5],
        value[6],
        value[7],
        value[8],
        value[9],
        value[10],
        value[11],
        value[12],
        value[13],
        value[14],
        value[15],
        value[16],
        value[17],
        value[18],
        value[19],
        value[20],
        value[21],
        value[22],
        value[23],
        value[24],
        value[25],
        value[26],
        value[27],
        value[28],
        value[29],
        value[30],
        value[31],
        value[32],
        value[33],
        value[34],
        value[35],
        value[36],
        value[37],
        value[38],
        value[39],
        value[40],
        value[41],
        value[42],
        value[43],
        value[44],
        value[45],
        value[46],
        value[47],
        value[48],
        value[49],
        value[50],
        value[51],
        value[52],
        value[53],
        value[54],
        value[55],
        value[56],
        value[57],
        value[58],
        value[59],
        value[60],
        value[61],
        value[62],
        value[63],
      ] as ExactArray64<A>
  );
}
