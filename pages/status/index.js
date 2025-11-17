import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const ResponseBody = await response.json();
  return ResponseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status </h1>
      <DatabaseStatus />
    </>
  );
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
    dedupingInterval: 2000,
  });

  let updateAtText = "Carregando";
  let maxConnections = "...";
  let openConnections = "...";
  let version = "...";

  if (!isLoading && data) {
    console.log(data);
    updateAtText = new Date(data.update_date).toLocaleString("pt-BR");
    maxConnections = data.dependences.database.max_connections;
    openConnections = data.dependences.database.open_connections;
    version = data.dependences.database.version;
  }
  return (
    <>
      <div>Última Atualização: {updateAtText} </div>
      <div>Máximo de Conexões: {maxConnections} </div>
      <div>Conexões Abertas: {openConnections} </div>
      <div>Versão do Banco: {version} </div>
    </>
  );
}
