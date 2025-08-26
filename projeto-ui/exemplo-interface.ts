interface Usuario {
  nome: string;
  idade: number;
  email?: string; // campo opcional
}

function exibirUsuario(usuario: Usuario): void {
  console.log(`Nome: ${usuario.nome}`);
  console.log(`Idade: ${usuario.idade}`);
  if (usuario.email) {
    console.log(`Email: ${usuario.email}`);
  }
}

const usr: Usuario = {
  nome: 'Gustavo',
  idade: 23,
  email: 'gustavo@email.com'
};

exibirUsuario(usr);