const app = {
  init: function() {
    // Je dois ecouter la soumission du formulaire
    document.querySelector('form').addEventListener('submit', app.handleSubmit);
  },

  handleSubmit: function(e) {
    // Je dois tout d'abord empecher l'envoi du formulaire
    e.preventDefault();

    // J'efface la div.result pour repartir sur la bonne couleur
    document.querySelector('.result').innerHTML = '';

    // Je dois recuperer la valeur de l'input
    const color = e.currentTarget.querySelector('input').value;

    // On commence par verifier :
    // Si la chaine de caracteres commence bien par #
    // Et si elle a, soit 4 carateres, soit 7 (en incluant le #)
    if (!color.startsWith('#') || (color.length !== 4 && color.length !== 7)) {
      // Si ce n'est pas le cas, alors on envoie un message d'erreur et on arrete la fonction
      alert('Code couleur invalide');
      // Et on arrete la fonction
      return;
    }

    // Puis je peux convertir en RGB, trouver la/les couleur(s) dominante(s) et le taux de gris
    const rgbElement = document.createElement('p');
    // Je lui donne son textContent
    rgbElement.textContent = 'Notation RGB : ' + app.toRGB(color);

    // Meme chose pour la/les couleur(s) dominante(s)
    const dominantColorsElement = document.createElement('p');
    // Je lui donne son textContent
    dominantColorsElement.textContent = 'Couleur(s) primaire(s) dominante(s) : ' + app.getDominantColors(color);

    // Meme chose pour le taux de gris
    const grayRateElement = document.createElement('p');
    // Je lui donne son textContent
    grayRateElement.textContent = 'Taux de gris : ' + app.getGrayRate(color);
    
    // je rajoute dans le body
    document.querySelector('.result').appendChild(rgbElement);
    document.querySelector('.result').appendChild(dominantColorsElement);
    document.querySelector('.result').appendChild(grayRateElement);

  },

  /**
   * Converti un code couleur HTML en notation RGB
   * 
   * @param {string} colorCode Code couleur HTML commencant par #
   */
  toRGB: function(colorCode) {
    // Conversion en INT des valeurs hexa :
    // Si on a un code couleur raccourci, comme #f0f ca veut dire qu'on a en fait #ff00ff, donc je dois doubler le caractere pour obtenir le vrai code hexa
    const redHex = colorCode.length === 4 ? colorCode.slice(1, 2) + colorCode.slice(1, 2) : colorCode.slice(1, 3);
    // Pareil pour le vert
    const greenHex = colorCode.length === 4 ? colorCode.slice(2, 3) + colorCode.slice(2, 3) : colorCode.slice(3, 5);
    // Pareil pour le bleu
    const blueHex = colorCode.length === 4 ? colorCode.slice(3, 4) + colorCode.slice(3, 4) : colorCode.slice(5, 7);

    // Puis on converti tout ca de l'hexadecimal vers des int
    // L'hexadecimal c'est que du comptage en base 16, donc on peut le convertir en base 10 grace a parseInt
    const redInt = parseInt(redHex, 16);
    const greenInt = parseInt(greenHex, 16);
    const blueInt = parseInt(blueHex, 16);

    // Et on retourne la valeur en format RGB
    return [redInt, greenInt, blueInt];
  },

  /**
   * Trouve la/les couleursprimaire(s) dominante(s)
   * 
   * @param {string} colorCode Code couleur HTML commencant par #
   */
  getDominantColors: function(colorCode) {
    // Je dois maintenant trouver la couleur primaire dominante
    // On peut utiliser Math.max pour connaitre la valeur RGB max
    // Je commence par recuperer les valeurs RGB
    const rgbValues = app.toRGB(colorCode);
    const max = Math.max(...rgbValues);

    // Il pourrait y avoir plusieurs couleurs dominantes
    // Donc je dois trouver tout les index qui correspondent a ma valeur max
    // indexOf me donnerait seulement le premier index qui a cette valeur
    // Donc je ne vois pas d'autres solutions qu'une boucle for

    // Je prepare un tableau qui me traduira l'index des couleurs dominantes en 'rouge', 'vert' ou 'bleu'
    const rgb = [
      'Rouge',
      'Vert',
      'Bleu',
    ];

    // Et je declare un tableau qui contiendra les couleurs dominantes qui seront rajoutées dans la boucle
    let dominantColors = [];

    // Puis je lance la boucle
    for (let i = 0; i < rgbValues.length; i++) {
      // Si la valeur à l'index i du tableau rgbValues est bien egale a max
      if (rgbValues[i] === max) {
        // Je traduis l'index
        let color = rgb[i];

        // Et j'ajoute la couleur à mon tableau dominantColors
        dominantColors.push(color);
      }
    }

    return dominantColors;

  },

  /**
   * Calcul le pourcentage de gris d'un couleur RGB
   * 
   * @param {string} colorCode Code couleur HTML commencant par #
   */
  getGrayRate: function(colorCode) {
    // Pour connaitre le pourcentage de gris d'une couleur, je peux me servir de son code HSL
    // Le S, la saturation, c'est 100% (minus) le pourcentage de gris
    // Selon https://fr.wikipedia.org/wiki/Teinte_saturation_luminosit%C3%A9#Depuis_RVB_2
    // Je doit d'abord trouver la valeur max entre le rouge, le vert et le bleu, et faire pareil avec la valeur min
    // Mon resultat de toRGB() etant un tableau, je dois utiliser l'operateur spread "..." pour fournir a Math.max et Math.min
    // Les valeurs RGB vont de 0 à 255, alors que pour calculer le HSL, je dois utiliser des valeurs de 0 à 1, donc je divise le tout par 255
    const max = Math.max(...app.toRGB(colorCode)) / 255;
    const min = Math.min(...app.toRGB(colorCode)) / 255;

    // Puis via la formule fournie, je calcule la saturation
    const luminosity = (max + min) / 2;
    const chroma = max - min;
    let saturation = chroma / (1 - Math.abs((2 * luminosity) - 1));

    // Si la chroma est = 0, alors la saturation sera 0
    if (chroma === 0) {
        saturation = 0;
    }

    // saturation est un nombre negatif compris entre -1 et 0 et represente le taux de "non gris"
    // Moi je veux l'inverse, le taux de gris, donc c'est ce qui reste de la soustraction de 1 - saturation
    // Et vu qu'on veut un taux, en pourcent c'est mieux, donc je multiplie par 100 et je rajoute "%" a la fin
    return (1 - saturation) * 100 + '%';
  }
}

document.addEventListener('DOMContentLoaded', app.init);