/**
 * Escapează un string JSON pentru a putea fi inclus dublu în JSON payload (backslash dublu)
 * Ex: " -> \\", \ -> \\
 */
export function doubleEscapeJson(jsonString) {
  return jsonString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * Construiește un mesaj binar pentru WebSocket Messenger, conform protocolului observat:
 * Prefix: 1 byte '2' (0x32), urmat de 3-4 bytes fix, apoi comanda (/ls_req) + \0 + payload JSON.
 * @param {string} path Comanda, ex: "/ls_req"
 * @param {object} payload Obiect JSON ce va fi dublu escape-uit și inclus în payload
 * @returns {Buffer} Buffer cu mesajul binar complet
 */
export function buildLsReqMessage(path, payload) {
  // Stringifică payload în JSON
  const jsonPayload = JSON.stringify(payload);
  // Double escape
  const escapedPayload = doubleEscapeJson(jsonPayload);

  // Construiește JSON complet pentru mesaj
  const messageObj = {
    app_id: "772021112871879",
    payload: escapedPayload,
    request_id: payload.request_id || 1,
    type: payload.type || 3
  };

  const messageJson = JSON.stringify(messageObj);

  // Construim bufferul final

  // Prefix exemplu observat: [0x32, 0x02, 0x00, 0x07]
  // 0x32 = '2', 0x07 = lungime path ("/ls_req".length)
  const prefix = Buffer.from([0x32, 0x02, 0x00, path.length]);
  const pathBuf = Buffer.from(path, 'utf-8');
  const zeroBuf = Buffer.from([0x00]);
  const messageBuf = Buffer.from(messageJson, 'utf-8');

  return Buffer.concat([prefix, pathBuf, zeroBuf, messageBuf]);
}
