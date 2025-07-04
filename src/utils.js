/**
 * Construiește mesajul WebSocket pentru Messenger, cu prefix binar + path + payload JSON stringificat
 * @param {string} path - comanda, ex: "/ls_req"
 * @param {string} jsonPayload - payload JSON stringificat
 * @returns {Buffer} - buffer care conține mesajul binar
 */
export function buildWsMessage(path, jsonPayload) {
  // Simplificat: construim un buffer cu prefixurile necesare conform analizelor tale
  // (în realitate, trebuie să adaptezi la protocolul exact)
  
  const prefix = Buffer.from([0x32, 0x1, 0x0, path.length]); // exemplu simplificat
  const pathBuf = Buffer.from(path, 'utf-8');
  const payloadBuf = Buffer.from(jsonPayload, 'utf-8');
  
  return Buffer.concat([prefix, pathBuf, Buffer.from([0x0]), payloadBuf]);
}

/**
 * Decodează un mesaj primit, extrage payload JSON
 * @param {Buffer} data - date brute primite
 * @returns {object} - obiect JSON extras
 */
export function parseWsMessage(data) {
  // Exemple minimal: găsește primul 0x00 după path și extrage JSON
  const zeroIndex = data.indexOf(0x00);
  if (zeroIndex === -1) return null;
  
  const jsonStr = data.slice(zeroIndex + 1).toString('utf-8');
  try {
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}
