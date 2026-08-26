import { canonicalUtf8Bytes } from "./canonical.js";

const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const ROUND_CONSTANTS = Uint32Array.from([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

export const REDACTED_HASH_CONTEXT = "[REDACTED]" as const;

export interface HashMismatchDiagnostic {
  readonly code: "CANONICAL_HASH_MISMATCH";
  readonly expectedSha256: string;
  readonly actualSha256: string;
  readonly artifactContext: typeof REDACTED_HASH_CONTEXT;
}

export class CanonicalHashMismatchError extends Error {
  readonly code = "CANONICAL_HASH_MISMATCH" as const;
  readonly diagnostic: HashMismatchDiagnostic;

  constructor(expectedSha256: string, actualSha256: string) {
    super("Canonical SHA-256 mismatch; artifact context was redacted.");
    this.name = "CanonicalHashMismatchError";
    this.diagnostic = Object.freeze({
      code: this.code,
      expectedSha256,
      actualSha256,
      artifactContext: REDACTED_HASH_CONTEXT,
    });
  }
}

function rotateRight(value: number, count: number): number {
  return (value >>> count) | (value << (32 - count));
}

export function sha256Hex(input: readonly number[] | Uint8Array): string {
  const length = input.length;
  const paddedLength = Math.ceil((length + 9) / 64) * 64;
  const message = new Uint8Array(paddedLength);
  for (let index = 0; index < length; index += 1) {
    const byte = input[index];
    if (byte === undefined || !Number.isInteger(byte) || byte < 0 || byte > 255) {
      throw new TypeError("SHA-256 input must contain bytes from 0 through 255.");
    }
    message[index] = byte;
  }
  message[length] = 0x80;

  const bitLength = length * 8;
  const highBits = Math.floor(bitLength / 0x1_0000_0000);
  const lowBits = bitLength >>> 0;
  const view = new DataView(message.buffer);
  view.setUint32(paddedLength - 8, highBits, false);
  view.setUint32(paddedLength - 4, lowBits, false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;
  const words = new Uint32Array(64);

  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let index = 0; index < 16; index += 1) {
      words[index] = view.getUint32(offset + (index * 4), false);
    }
    for (let index = 16; index < 64; index += 1) {
      const word15 = words[index - 15] ?? 0;
      const word2 = words[index - 2] ?? 0;
      const sigma0 = rotateRight(word15, 7) ^ rotateRight(word15, 18) ^ (word15 >>> 3);
      const sigma1 = rotateRight(word2, 17) ^ rotateRight(word2, 19) ^ (word2 >>> 10);
      words[index] = ((words[index - 16] ?? 0) + sigma0 + (words[index - 7] ?? 0) + sigma1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let index = 0; index < 64; index += 1) {
      const sigma1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choose = (e & f) ^ (~e & g);
      const temporary1 = (h + sigma1 + choose + (ROUND_CONSTANTS[index] ?? 0) + (words[index] ?? 0)) >>> 0;
      const sigma0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temporary2 = (sigma0 + majority) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temporary1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temporary1 + temporary2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map((word) => word.toString(16).padStart(8, "0"))
    .join("");
}

export function hashCanonicalValue(value: unknown): string {
  return sha256Hex(canonicalUtf8Bytes(value));
}

export function verifyCanonicalHash(value: unknown, expectedSha256: string): string {
  if (!SHA256_PATTERN.test(expectedSha256)) {
    throw new TypeError("Expected SHA-256 must be 64 lowercase hexadecimal characters.");
  }
  const actualSha256 = hashCanonicalValue(value);
  if (actualSha256 !== expectedSha256) {
    throw new CanonicalHashMismatchError(expectedSha256, actualSha256);
  }
  return actualSha256;
}
