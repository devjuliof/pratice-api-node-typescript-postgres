import { server } from "./server/server";

server.listen(3333, () => {
  console.log("app rodando na porta 3333");
});
