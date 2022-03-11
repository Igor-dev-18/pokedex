// id do primeiro pokémon
let startPokemon = 1;
// id do último pokémon
let endPokemon = 898;

// botão que irá carregar mais pokémons
const btnLoadPokemons = document.querySelector('.btn-load-pokemons');


// função que recupera o pokémon
async function getPokemon(pokemonId) {

    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const response = await fetch(url);

    // se o status HTTP for equivalente a um erro
    // então lançaremos um erro para ser tratado posteriormente
    if (!response.ok) {
        const msg = `Um problema ocorreu! status: ${response.status}`;
        throw new Error(msg);
    }
    // se caso o erro não ocorrer então iremos
    // converter a resposta em um objeto e retorná-lo
    const pokemon = await response.json();
    return pokemon;
}

// função que criar os cards
function createPokemonCard(pokemon) {
    const pokemonCard = document.createElement('li');
    pokemonCard.setAttribute('class', 'pokemon');

    // pokémon types - extraindo os tipos do pokémon
    const types = pokemon.types.map(value => value.type.name);
    // add o 1º type ao card
    // o 1º type define a cor do card
    pokemonCard.classList.add(types[0]);

    // reduzindo (reduce) o array de types em uma string
    // essa string contém os types em spans especificos
    // cada span tem uma class que leva o nome do type
    // os spans serão serão estilizados via CSS
    const typesTemplate = types.reduce((acc, type) => {
        acc += `<span class="${type}">${type}</span>`;
        return acc;
    }, ' ');

    // adicionar zeros à esquerda ao id do pokémon
    // de (1 até 9) = 001 - 009
    // de (10 até 99) = 010 - 099
    // de (100 em diante) 100 - 898
    let idFormatado = '';
    if (pokemon.id < 10) idFormatado = `00${pokemon.id}`;
    else if (pokemon.id < 100) idFormatado = `0${pokemon.id}`;
    else idFormatado = pokemon.id;

    //console.log(typesTemplate);

    // gerando o conteúdo interno do card
    pokemonCard.innerHTML = `
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="${pokemon.name}" class="pokemon__img">
                    <h2 class="pokemon__name">${pokemon.name}</h2>
                    <span class="pokemon__id">Nº ${idFormatado}</span>
                    <div>${typesTemplate}</div>
                    
                    
    `;

    return pokemonCard;

}



// função que insere o pokémon na lista de pokémons - pokédex
function insertPokemonInPokedex(pokemon) {
    // lista - pokédex
    const pokedex = document.querySelector('.pokedex');
    // criando o card
    const pk = createPokemonCard(pokemon);
    // inserindo o card criado
    pokedex.appendChild(pk);

}

// função que carrega os pokémons
async function loadPokemons() {
    // iremos tentar executar a função
    // se algum erro acontecer durante alguma requisição
    // iremos desviar o código para o catch e apresentar um erro
    try {
        // contador que irá controlar o fluxo de exibição
        // iremos exibir apenas 12 pokémons a cada chamada da função
        let contador = 1;

        for (let i = startPokemon; i <= endPokemon; i++) {
            // recuperando o pokemon
            const pokemon = await getPokemon(i).then(response => response);
            // console.log(pokemon.types[0].type.name);
            // inserindo o pokemon na pokédex
            insertPokemonInPokedex(pokemon);

            if (contador === 12) break;
            contador++;
        }
        startPokemon += contador;
    }
    catch (error) {
        console.log(error);
    }

}


loadPokemons();

btnLoadPokemons.addEventListener('click', loadPokemons);

