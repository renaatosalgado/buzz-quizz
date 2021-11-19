const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v4/buzzquizz";
const QUIZZES_API ="https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
const APP = document.querySelector(".app");


//============== TELA 01 ==============//

//============== TELA 02 ==============//


function frame_2(){
  let prommisse_quiz_selected=axios.get(QUIZZES_API);
  prommisse_quiz_selected.then(load_quiz)
  prommisse_quiz_selected.catch(console.log("Eita"))

  function load_quiz(response){
    let quiz_data=response.data;
    let quiz_selecionado=quiz_data[1];// aqui vai o quiz selecionado
    let questions = quiz_selecionado.questions; // aqui vai as questões 
    //let answers = (questions[0].answers).sort(randOrd) // aqui vai as respostas refererente a  questão 0
    console.log(questions);
    
    APP.innerHTML=`   
      <div class="top-quiz-container">
      <img class ="icon-main-image"src="${quiz_selecionado.image}" alt="">
      <span  class="quiz-title">${quiz_selecionado.title}</span>
      </div>
      <div class="quiz-container">         
      </div>
    `;
    for(let i=0;i<questions.length;i++){
      let answers = (questions[i].answers).sort(randOrd)

      APP.querySelector(".quiz-container").innerHTML +=
      `
      <div class="question-container">
        <div style="background-color: ${questions[i].color}" class="question-title"><span>${questions[i].title}</span></div>
        <div class="quiz-answers">
          <div class="answer">
            <img src="${answers[0].image}" alt="">
            <p>${answers[0].text}</p>
          </div>
          <div class="answer">
            <img src="${answers[1].image}" alt="">
            <p>${answers[1].text}</p> 
          </div>
          <div class="answer">
            <img src="${answers[2].image}" alt="">
            <p>${answers[2].text}</p>
          </div>
          <div class="answer">
            <img src="${answers[3].image}" alt="">
            <p>${answers[3].text}</p>
          </div>
        </div>
      </div>    
      `
    }}}

frame_2() // função de teste  para a tela 2




//============== TELA 03 ==============//

let CREATED_QUIZZ = {};

function quizzGenerator() {
  CREATED_QUIZZ = {
    title: "",
    image: "",
    qttQuestions: 0,
    qttLevels: 0,
    questions: [],
    levels: [],
  };

  APP.innerHTML = `
    <div class="page-create-quizz">
      <div class="title">Comece pelo começo</div>
      <div class="entries">
          <input type="text" class="title" placeholder="Título do seu quizz">
          <input type="text" class="url" placeholder="URL da imagem do seu quizz">
          <input type="number" class="quantity-questions" placeholder="Quantidade de perguntas do quizz">
          <input type="number" class="quantity-levels" placeholder="Quantidade de níveis do quizz">
      </div>
      <button class="proceed" onclick="quizzGeneratorQuestions()">Prosseguir pra criar perguntas</button>
    </div>
  `;
}

function saveQuizzMainValues() {
  const title = document.querySelector(".entries .title").value;
  const image = document.querySelector(".entries .url").value;
  const qttQuestions = document.querySelector(
    ".entries .quantity-questions"
  ).value;
  const qttLevels = document.querySelector(".entries .quantity-levels").value;

  CREATED_QUIZZ.title = title;
  CREATED_QUIZZ.image = image;
  CREATED_QUIZZ.qttQuestions = parseInt(qttQuestions);
  CREATED_QUIZZ.qttLevels = parseInt(qttLevels);
}

function checkQuizzMainPart() {
  saveQuizzMainValues();

  if (CREATED_QUIZZ.title.length < 20 || CREATED_QUIZZ.title.length > 65) {
    return false;
  } else if (!checkURL(CREATED_QUIZZ.image)) {
    return false;
  } else if (CREATED_QUIZZ.qttQuestions < 3) {
    return false;
  } else if (CREATED_QUIZZ.qttLevels < 2) {
    return false;
  }
  return true;
}

function quizzGeneratorQuestions() {
  console.log("entrei aqui");
  const valid = checkQuizzMainPart();
  if (!valid) {
    alert("Preencha os campos corretamente!");
    return;
  }
  alert("Deu certo, tudo correto!");
}

//============== AUX FUNCTIONS ==============//
function randOrd(){ //função para embaralhar as respostas
  return (Math.round(Math.random())-0.5);
}
function checkURL(url) {
  const rule =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
  return rule.test(url);
}

//quizzGenerator(); // coloquei essa função inicial somente para testar o layout, pode remover ela
