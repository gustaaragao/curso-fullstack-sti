function exibirUsuario(usuario) {
    console.log("Nome: ".concat(usuario.nome));
    console.log("Idade: ".concat(usuario.idade));
    if (usuario.email) {
        console.log("Email: ".concat(usuario.email));
    }
}
var usr = {
    nome: 'Gustavo',
    //   idade: 23,
    email: 'gustavo@email.com'
};
exibirUsuario(usr);
