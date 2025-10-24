function status(request, response) {
  response.status(200).json({ chave: "São Acima da média" });
}

export default status;
