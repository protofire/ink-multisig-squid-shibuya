export function uint8ArrayToHexString(uint8Array: Uint8Array): string {
  return (
    "0x" +
    Array.from(uint8Array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    )
  );
}

export function hexStringToUint8Array(hexString: string): Uint8Array {
  // Remove the "0x" prefix, if it exists
  if (hexString.startsWith("0x")) {
    hexString = hexString.slice(2);
  }

  const length = hexString.length / 2;
  const uint8Array = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    const byte = parseInt(hexString.substr(i * 2, 2), 16);
    uint8Array[i] = byte;
  }

  return uint8Array;
}


export function toEntityMap<E extends { addressHex: string }>(
  entities: E[]
): Map<string, E> {
  return new Map(entities.map((e) => [e.addressHex, e]));
}

export function toEntityMapTx<E extends { id: string }>(
  entities: E[]
): Map<string, E> {
  return new Map(entities.map((e) => [e.id, e]));
}
