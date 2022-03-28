// Obtener los elementos y asignarlos a las variables
const pokeInput = document.getElementById('pokeInput');
const shinyButton = document.getElementById('shinyButton');
const flipButton = document.getElementById('flipButton');
const maleButton = document.getElementById('maleButton');
const femaleButton = document.getElementById('femaleButton');
const maleIcon = document.getElementById('maleIcon');
const femaleIcon = document.getElementById('femaleIcon');
const pokeImage = document.getElementById('pokeImage');
const pokeName = document.getElementById('pokeName');
const pokeNumber = document.getElementById('pokeNumber');
const upButton = document.getElementById('upButton');
const rightButton = document.getElementById('rightButton');
const downButton = document.getElementById('downButton');
const leftButton = document.getElementById('leftButton');
const pokeData = document.getElementById('pokeData');
const pokeStats = document.getElementById('pokeStats');
const pokeMovements = document.getElementById('pokeMovements');

//Crear variables para los botones de cambiar imágen
var frontImg = true;
var shinyImg = false;
var genderImg = 'male';

//Ejecutar la función searchPokemon cuando el usuario presione la tecla enter en pokeInput
pokeInput.addEventListener("keypress", function(e) {
    if (e.key == 'Enter') {
        searchPokemon();
    }
});

//Función buscar Pokémon
const searchPokemon = () => {
    //Limpiar datos de la pokédex
    clearPokedex();
    //Buscar información del pokémon
    let pokemonSearch = pokeInput.value;
    pokeInput.value = "";
    pokeName.innerHTML = "Cargando...";
    let url;
    //Si la búsqueda no es un número, convertir las letras a minúsculas, en caso contrario, quitar los ceros de la izquierda cuando se busca un pokemon
    if (isNaN(pokemonSearch) == true) {
        url = "https://pokeapi.co/api/v2/pokemon/" + pokemonSearch.toLowerCase();
    } else {
        url = "https://pokeapi.co/api/v2/pokemon/" + Number(pokemonSearch);
    }
    fetch(url).then((res) => {
        //Si el estatus de la petición es diferente a 200 enviar datos de error a la pantalla principal
        if (res.status != 200) {
            let pokeId = '';
            let pokemon = '¡No encontrado!';
            let pokeImg = "./assets/img/pokemon-sad.gif";
            infoMainScreen(pokeId, pokemon, pokeImg);
        } else {
            return res.json();
        }
    }).then((data) => {
        //ID, nombre, peso y altura
        pokeId = data.id;
        pokemon = data.name;
        let pokeWeight = data.weight;
        let pokeHeight = data.height;
        //Tipo de pokémon
        let pokeType = data.types;
        //Si el pokémon tiene 2 tipos, enviarlos a la función de infoPokeData, en caso contrario enviar el tipo 2 vacío
        if (pokeType.length == 2) {
            let type1 = pokeType[0].type.name;
            let type2 = pokeType[1].type.name;
            infoPokeData(pokeWeight, pokeHeight, type1, type2);
        } else {
            type1 = pokeType[0].type.name;
            type2 = '';
            infoPokeData(pokeWeight, pokeHeight, type1, type2);
        }
        //Imágenes del pokémon (frente, atrás, masculino, femenino y shiny)
        pokeImg = data.sprites.front_default;
        pokeImgB = data.sprites.back_default;
        pokeImgF = data.sprites.front_female;
        pokeImgBF = data.sprites.back_female;
        pokeImgS = data.sprites.front_shiny;
        pokeImgBS = data.sprites.back_shiny;
        pokeImgSF = data.sprites.front_shiny_female;
        pokeImgBSF = data.sprites.back_shiny_female;
        //Estadísticas
        let hp = data.stats[0].base_stat;
        let attack = data.stats[1].base_stat;
        let defense = data.stats[2].base_stat;
        let specialAttack = data.stats[3].base_stat;
        let specialDefense = data.stats[4].base_stat;
        let speed = data.stats[5].base_stat;
        //Movimientos
        let moves = data.moves;
        let movesArray = [];
        moves.forEach(function(value) {
            let moveName = value.move.name;
            movesArray.push(moveName);
        });
        let pokeMoves = movesArray.join(', ');

        //Enviar los datos a las diferentes secciones de la pokedex
        infoMainScreen(pokeId, pokemon, pokeImg, pokeImgB, pokeImgF, pokeImgS);
        infoPokemon(hp, attack, defense, specialAttack, specialDefense, speed);
        infoMovements(pokeMoves);

    });
};

//Función para limpiar la Pokédex
const clearPokedex = () => {
    pokeImage.src = "";
    pokeName.innerHTML = "";
    pokeNumber.innerHTML = "";
    pokeData.innerHTML = "";
    pokeStats.innerHTML = "";
    pokeMovements.innerHTML = "";
    shinyButton.style.display = 'none';
    flipButton.style.display = 'none';
    maleButton.style.display = 'none';
    femaleButton.style.display = 'none';
    frontImg = true;
    shinyImg = false;
    genderImg = 'male';
};

//Función para mostrar la información del Pokémon en la pantalla principal
const infoMainScreen = (pokeId, pokemon, pokeImg, pokeImgB, pokeImgF, pokeImgS) => {
    //Añadir los ceros a la izquierda al número de Pokémon cuando corresponda
    if (pokeId != '') {
        let name = pokemon.charAt(0).toUpperCase() + pokemon.substring(1);
        if (pokeId.toString().length == 1) {
            pokeNumber.innerHTML = '00' + pokeId;
        } else if (pokeId.toString().length == 2) {
            pokeNumber.innerHTML = '0' + pokeId;
        } else {
            pokeNumber.innerHTML = pokeId;
        }
        pokeName.innerHTML = name;
        pokeImage.src = pokeImg;
        //Añadir los botones correspondientes para visualizar las diferentes imágenes de los Pokémones
        if (pokeImgS != null) {
            shinyButton.style.display = 'block';
        }
        if (pokeImgB != null) {
            flipButton.style.display = 'block';
        }
        if (pokeImgF != null) {
            maleButton.style.display = 'block';
            femaleButton.style.display = 'block';
            maleIcon.style.color = '#727272';
            femaleIcon.style.color = '#000000';
        }
    } else {
        pokeName.innerHTML = pokemon;
        pokeImage.src = pokeImg;
        shinyButton.style.display = 'none';
        flipButton.style.display = 'none';
        maleButton.style.display = 'none';
        femaleButton.style.display = 'none';
    }
};

//Función para mostrar el pokemon en versión Shiny
const showPokeShiny = () => {
    //Pokémon Shiny default
    if (frontImg == true && genderImg == 'male' && shinyImg == false) {
        pokeImage.src = pokeImgS;
        shinyImg = true;
    } else if (frontImg == true && genderImg == 'male' && shinyImg == true) {
        pokeImage.src = pokeImg;
        shinyImg = false;
    }
    //Pokémon Shiny girado
    if (frontImg == false && genderImg == 'male' && shinyImg == false) {
        pokeImage.src = pokeImgBS;
        shinyImg = true;
    } else if (frontImg == false && genderImg == 'male' && shinyImg == true) {
        pokeImage.src = pokeImgB;
        shinyImg = false;
    }
    //Pokémon Shiny hembra
    if (frontImg == true && genderImg == 'female' && shinyImg == false) {
        pokeImage.src = pokeImgSF;
        shinyImg = true;
    } else if (frontImg == false && genderImg == 'female' && shinyImg == false) {
        //Si la imagen no existe, mostrar la imagen del Pokémon default
        if (pokeImgBSF != null) {
            pokeImage.src = pokeImgBSF;
        } else {
            pokeImage.src = pokeImgBS;
        }
        shinyImg = true;
    } else if (frontImg == true && genderImg == 'female' && shinyImg == true) {
        pokeImage.src = pokeImgF;
        shinyImg = false;
    } else if (frontImg == false && genderImg == 'female' && shinyImg == true) {
        //Si la imagen no existe, mostrar la imagen del Pokémon default
        if (pokeImgBF != null) {
            pokeImage.src = pokeImgBF;
        } else {
            pokeImage.src = pokeImgB;
        }
        shinyImg = false;
    }
};

//Función para mostrar el pokemon girado
const showPokeFlip = () => {
    //Girar Pokémon default
    if (frontImg == true && genderImg == 'male' && shinyImg == false) {
        pokeImage.src = pokeImgB;
        frontImg = false;
    } else if (frontImg == false && genderImg == 'male' && shinyImg == false) {
        pokeImage.src = pokeImg;
        frontImg = true;
    }
    //Girar Pokémon Shiny
    if (frontImg == true && genderImg == 'male' && shinyImg == true) {
        pokeImage.src = pokeImgBS;
        frontImg = false;
    } else if (frontImg == false && genderImg == 'male' && shinyImg == true) {
        pokeImage.src = pokeImgS;
        frontImg = true;
    }
    //Girar Pokémon Hembra
    if (frontImg == true && genderImg == 'female' && shinyImg == false) {
        //Si la imagen no existe, mostrar la imagen del Pokémon default
        if (pokeImgBF != null) {
            pokeImage.src = pokeImgBF;
        } else {
            pokeImage.src = pokeImgB;
        }
        frontImg = false;
    } else if (frontImg == false && genderImg == 'female' && shinyImg == false) {
        pokeImage.src = pokeImgF;
        frontImg = true;
    }
    //Girar Pokémon Shiny Hembra
    if (frontImg == true && genderImg == 'female' && shinyImg == true) {
        //Si la imagen no existe, mostrar la imagen del Pokémon default
        if (pokeImgBF != null) {
            pokeImage.src = pokeImgBSF;
        } else {
            pokeImage.src = pokeImgBS;
        }
        frontImg = false;
    } else if (frontImg == false && genderImg == 'female' && shinyImg == true) {
        pokeImage.src = pokeImgSF;
        frontImg = true;
    }
};

//Función para mostrar el Pokémon del género contrario
const showPokeGender = (gender) => {
    //Cambiar género default
    if (frontImg == true && gender == 'male' && gender != genderImg && shinyImg == false) {
        pokeImage.src = pokeImg;
        genderImg = 'male';
        maleIcon.style.color = '#727272';
        femaleIcon.style.color = '#000000';
    } else if (frontImg == true && gender == 'female' && gender != genderImg && shinyImg == false) {
        pokeImage.src = pokeImgF;
        genderImg = 'female';
        femaleIcon.style.color = '#727272';
        maleIcon.style.color = '#000000';
    }
    //Cambiar género girado
    if (frontImg == false && gender == 'male' && gender != genderImg && shinyImg == false) {
        pokeImage.src = pokeImgB;
        genderImg = 'male';
        maleIcon.style.color = '#727272';
        femaleIcon.style.color = '#000000';
    } else if (frontImg == false && gender == 'female' && gender != genderImg && shinyImg == false) {
        //Si la imagen no existe, mostrar la imagen del Pokémon default
        if (pokeImgBF != null) {
            pokeImage.src = pokeImgBF;
        } else {
            pokeImage.src = pokeImgB;
        }
        genderImg = 'female';
        femaleIcon.style.color = '#727272';
        maleIcon.style.color = '#000000';
    }
    //Cambiar género shiny default
    if (frontImg == true && gender == 'male' && gender != genderImg && shinyImg == true) {
        pokeImage.src = pokeImgS;
        genderImg = 'male';
        maleIcon.style.color = '#727272';
        femaleIcon.style.color = '#000000';
    } else if (frontImg == true && gender == 'female' && gender != genderImg && shinyImg == true) {
        pokeImage.src = pokeImgSF;
        genderImg = 'female';
        femaleIcon.style.color = '#727272';
        maleIcon.style.color = '#000000';
    }
    //Cambiar género shiny girado
    if (frontImg == false && gender == 'male' && gender != genderImg && shinyImg == true) {
        pokeImage.src = pokeImgBS;
        genderImg = 'male';
        maleIcon.style.color = '#727272';
        femaleIcon.style.color = '#000000';
    } else if (frontImg == false && gender == 'female' && gender != genderImg && shinyImg == true) {
        //Si la imagen no existe, mostrar la imagen del Pokémon default
        if (pokeImgBSF != null) {
            pokeImage.src = pokeImgBSF;
        } else {
            pokeImage.src = pokeImgBS;
        }
        genderImg = 'female';
        femaleIcon.style.color = '#727272';
        maleIcon.style.color = '#000000';
    }
};

//Función buscar siguiente Pokémon
const nextPokemon = () => {
    //Limpiar datos de la pokédex
    clearPokedex();
    //Buscar información del pokémon
    let pokemonSearch = pokeId + 1;
    pokeInput.value = "";
    pokeName.innerHTML = "Cargando...";
    const url = "https://pokeapi.co/api/v2/pokemon/" + pokemonSearch;
    fetch(url).then((res) => {
        //Si el estatus de la petición es diferente a 200 enviar datos de error a la pantalla principal
        if (res.status != 200) {
            let pokeId = '';
            let pokemon = '¡No encontrado!';
            let pokeImg = "./assets/img/pokemon-sad.gif";
            infoMainScreen(pokeId, pokemon, pokeImg);
        } else {
            return res.json();
        }
    }).then((data) => {
        //ID, nombre, peso y altura
        pokeId = data.id;
        pokemon = data.name;
        let pokeWeight = data.weight;
        let pokeHeight = data.height;
        //Tipo de pokémon
        let pokeType = data.types;
        //Si el pokémon tiene 2 tipos, enviarlos a la función de infoPokemon
        if (pokeType.length == 2) {
            let type1 = pokeType[0].type.name;
            let type2 = pokeType[1].type.name;
            infoPokeData(pokeWeight, pokeHeight, type1, type2);
        } else {
            type1 = pokeType[0].type.name;
            type2 = '';
            infoPokeData(pokeWeight, pokeHeight, type1, type2);
        }
        //Imágenes del pokémon (frente, atrás, masculino, femenino y shiny)
        pokeImg = data.sprites.front_default;
        pokeImgB = data.sprites.back_default;
        pokeImgF = data.sprites.front_female;
        pokeImgBF = data.sprites.back_female;
        pokeImgS = data.sprites.front_shiny;
        pokeImgBS = data.sprites.back_shiny;
        pokeImgSF = data.sprites.front_shiny_female;
        pokeImgBSF = data.sprites.back_shiny_female;
        //Estadísticas
        let hp = data.stats[0].base_stat;
        let attack = data.stats[1].base_stat;
        let defense = data.stats[2].base_stat;
        let specialAttack = data.stats[3].base_stat;
        let specialDefense = data.stats[4].base_stat;
        let speed = data.stats[5].base_stat;
        //Movimientos
        let moves = data.moves;
        let movesArray = [];
        moves.forEach(function(value) {
            let moveName = value.move.name;
            movesArray.push(moveName);
        });
        let pokeMoves = movesArray.join(', ');

        //Enviar los datos a las diferentes secciones de la pokedex
        infoMainScreen(pokeId, pokemon, pokeImg, pokeImgB, pokeImgF, pokeImgS);
        infoPokemon(hp, attack, defense, specialAttack, specialDefense, speed);
        infoMovements(pokeMoves);

    });
};

//Función buscar siguiente Pokémon
const prevPokemon = () => {
    //Limpiar datos de la pokédex
    clearPokedex();
    //Buscar información del pokémon
    let pokemonSearch = pokeId - 1;
    pokeInput.value = "";
    pokeName.innerHTML = "Cargando...";
    const url = "https://pokeapi.co/api/v2/pokemon/" + pokemonSearch;
    fetch(url).then((res) => {
        //Si el estatus de la petición es diferente a 200 enviar datos de error a la pantalla principal
        if (res.status != 200) {
            let pokeId = '';
            let pokemon = '¡No encontrado!';
            let pokeImg = "./assets/img/pokemon-sad.gif";
            infoMainScreen(pokeId, pokemon, pokeImg);
        } else {
            return res.json();
        }
    }).then((data) => {
        //ID, nombre, peso y altura
        pokeId = data.id;
        pokemon = data.name;
        let pokeWeight = data.weight;
        let pokeHeight = data.height;
        //Tipo de pokémon
        let pokeType = data.types;
        //Si el pokémon tiene 2 tipos, enviarlos a la función de infoPokemon
        if (pokeType.length == 2) {
            let type1 = pokeType[0].type.name;
            let type2 = pokeType[1].type.name;
            infoPokeData(pokeWeight, pokeHeight, type1, type2);
        } else {
            type1 = pokeType[0].type.name;
            type2 = '';
            infoPokeData(pokeWeight, pokeHeight, type1, type2);
        }
        //Imágenes del pokémon (frente, atrás, masculino, femenino y shiny)
        pokeImg = data.sprites.front_default;
        pokeImgB = data.sprites.back_default;
        pokeImgF = data.sprites.front_female;
        pokeImgBF = data.sprites.back_female;
        pokeImgS = data.sprites.front_shiny;
        pokeImgBS = data.sprites.back_shiny;
        pokeImgSF = data.sprites.front_shiny_female;
        pokeImgBSF = data.sprites.back_shiny_female;
        //Estadísticas
        let hp = data.stats[0].base_stat;
        let attack = data.stats[1].base_stat;
        let defense = data.stats[2].base_stat;
        let specialAttack = data.stats[3].base_stat;
        let specialDefense = data.stats[4].base_stat;
        let speed = data.stats[5].base_stat;
        //Movimientos
        let moves = data.moves;
        let movesArray = [];
        moves.forEach(function(value) {
            let moveName = value.move.name;
            movesArray.push(moveName);
        });
        let pokeMoves = movesArray.join(', ');

        //Enviar los datos a las diferentes secciones de la pokedex
        infoMainScreen(pokeId, pokemon, pokeImg, pokeImgB, pokeImgF, pokeImgS);
        infoPokemon(hp, attack, defense, specialAttack, specialDefense, speed);
        infoMovements(pokeMoves);

    });
};

//Función para mostrar el peso y la altura del Pokémon
const infoPokeData = (pokeWeight, pokeHeight, type1, type2) => {
    //Convertir el peso a kg y la altura a m
    let weight = pokeWeight / 10;
    let height = pokeHeight / 10;
    if (type2 != '') {
        pokeData.innerHTML = '<p>' + '<b>Types: </b>' + type1 + ', ' + type2 + '<br>' +
            '<b>Weight: </b>' + weight + 'kg' + '<br>' +
            '<b>Height: </b>' + height + 'm</p>';
    } else {
        pokeData.innerHTML = '<p>' + '<b>Type: </b>' + type1 + '<br>' +
            '<b>Weight: </b>' + weight + 'kg' + '<br>' +
            '<b>Height: </b>' + height + 'm</p>';
    }
};

//Función para mostrar las estadísticas del Pokémon
const infoPokemon = (hp, attack, defense, specialAttack, specialDefense, speed) => {
    //Convertir las estadísticas en porcentaje
    let pokeHp = ((hp * 100) / 255).toFixed(2);
    let pokeAttack = ((attack * 100) / 255).toFixed(2);
    let pokeDefense = ((defense * 100) / 255).toFixed(2);
    let pokeSpecialAttack = ((specialAttack * 100) / 255).toFixed(2);
    let pokespecialDefense = ((specialDefense * 100) / 255).toFixed(2);
    let pokeSpeed = ((speed * 100) / 255).toFixed(2);

    //Crear gráfica de HP
    const hpChart = document.createElement("div");
    hpChart.setAttribute('class', 'stats');
    hpChart.setAttribute('style', 'grid-template-rows:' + (100 - pokeHp) + '%' + ' ' + pokeHp + '%');
    hpChart.innerHTML = '<div>' + hp + '</div><div></div><div><span>HP</span></div>';
    //Crear gráfica de Ataque
    const attackChart = document.createElement("div");
    attackChart.setAttribute('class', 'stats');
    attackChart.setAttribute('style', 'grid-template-rows:' + (100 - pokeAttack) + '%' + ' ' + pokeAttack + '%');
    attackChart.innerHTML = '<div>' + attack + '</div><div></div><div><span>Attack</span></div>';
    //Crear gráfica de Defensa
    const defenseChart = document.createElement("div");
    defenseChart.setAttribute('class', 'stats');
    defenseChart.setAttribute('style', 'grid-template-rows:' + (100 - pokeDefense) + '%' + ' ' + pokeDefense + '%');
    defenseChart.innerHTML = '<div>' + defense + '</div><div></div><div><span>Defense</span></div>';
    //Crear gráfica de Ataque especial
    const specialAttackChart = document.createElement("div");
    specialAttackChart.setAttribute('class', 'stats');
    specialAttackChart.setAttribute('style', 'grid-template-rows:' + (100 - pokeSpecialAttack) + '%' + ' ' + pokeSpecialAttack + '%');
    specialAttackChart.innerHTML = '<div>' + specialAttack + '</div><div></div><div><span>Special Attack</span></div>';
    //Crear gráfica de Defensa especial
    const specialDefenseChart = document.createElement("div");
    specialDefenseChart.setAttribute('class', 'stats');
    specialDefenseChart.setAttribute('style', 'grid-template-rows:' + (100 - pokespecialDefense) + '%' + ' ' + pokespecialDefense + '%');
    specialDefenseChart.innerHTML = '<div>' + specialDefense + '</div><div></div><div><span>Special Defense</span></div>';
    //Crear gráfica de Velocidad
    const speedChart = document.createElement("div");
    speedChart.setAttribute('class', 'stats');
    speedChart.setAttribute('style', 'grid-template-rows:' + (100 - pokeSpeed) + '%' + ' ' + pokeSpeed + '%');
    speedChart.innerHTML = '<div>' + speed + '</div><div></div><div><span>Speed<span></div>';

    //Borrar datos de la gráfica
    while (pokeStats.firstChild) {
        pokeStats.removeChild($contenedorGraphic.firstChild);
    }

    //Insertar las gráficas en la pokédex
    pokeStats.prepend(speedChart);
    pokeStats.prepend(specialDefenseChart);
    pokeStats.prepend(specialAttackChart);
    pokeStats.prepend(defenseChart);
    pokeStats.prepend(attackChart);
    pokeStats.prepend(hpChart);

};

//Función para mostrar los movimientos del Pokémon
const infoMovements = (pokeMoves) => {
    pokeMovements.innerHTML = 'Movements:\n' + pokeMoves;
};