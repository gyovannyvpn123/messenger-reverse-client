import { MessengerClient } from './index.js';

(async () => {
  const cookie = 'xs=...; pas=...; c_user=...; sb=...; locale=en_US; oo=v1; datr=...'; // Pune cookie-ul tău valid

  const client = new MessengerClient({ cookie });

  await client.connect();

  // Trimite un ls_req gol (fără task-uri)
  client.sendLsReq([]);

  // Așteaptă câteva secunde să vezi răspunsurile în consolă
  setTimeout(() => {
    console.log('Închidem conexiunea');
    client.ws.close();
  }, 5000);
})();
