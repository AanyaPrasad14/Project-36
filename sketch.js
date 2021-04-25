//making the variables
var dog,happydDog, sadDog;
var database;
var foodStock,foodS, foodObj;
var feed, addFood;
var fedTime, lastFed, currentTime;
var bedroom, garden, washroom, livroom;
//assigning gamestate
var gameState = "hungry";
//making a variable to read the gamestate in the database
var readstate;

function preload(){
//loading the images
  dogimg = loadImage("virtual pet images/Dog.png");
  dogimg2 = loadImage("virtual pet images/Happy.png");
  sadDog = loadImage("virtual pet images/Lazy.png");

  bedroom = loadImage("virtual pet images/Bed Room.png");
  garden = loadImage("virtual pet images/Garden.png");
  washroom = loadImage("virtual pet images/Wash Room.png");
  livroom = loadImage("virtual pet images/Living Room.png");

}

function setup() {
  //creating the canvas
  createCanvas(1000,500);

  //assigning the database to the database variable
  //reffering to the database, Food
  database = firebase.database();
  foodStock = database.ref('Food');

  //creating the food
  foodObj = new Food;

  //creating the dog
  dog = createSprite(800,220,150,150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  //creating the feed button
  feed = createButton("Feed Bruno");
  feed.position(700,95);
  //when you press the button, then it must work as the function feeddog
  feed.mousePressed(feedDog);

  //creating the add food button
  addFood = createButton("Add more Food");
  addFood.position(800,95);
  //when you press the button, then it must work as the function addfoodsx
  addFood.mousePressed(addFoods);

  //reading the gamestate in the database and assigning it to the gamestate variable
  readstate = database.ref("GameState");
  readstate.on("value", function(data){
    gameState = data.val();
  })
 
}


function draw() {  
background("green");

//adding the time when you had last fed the dog
//reffering to the database feedtime
//assigning the data to the variable lastfed
fedTime = database.ref("FeedTime");
fedTime.on("value", function(data){
  lastFed = data.val();
})

//assigning values to the text
fill(255);
textSize(20);

//creating a condition to know the time (AM/PM)
//if the last fed is more than 12 hours(after 12:00 AM, then the value must be assigned as PM

if(lastFed >= 12){
  text("Last Feed : " + lastFed % 12 + " PM", 350, 30);
}else
//or else if last fed is 12:00 AM, then the text must be displayed as 12 AM
if(lastFed === 0){
  text("Last Feed = 12 AM", 350, 30);
}
//or else if it is none of the above then the last fed value must be assigned as AM
else{text("Last Feed : " + lastFed + " AM", 350, 30);
}

//if gamestate is not hungry, then the buttons must dissapear and the dog must be removed
if(gameState != "hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}
//else it should display everything, and the dog must be sad
else
if(gameState === "hungry"){
  feed.show();
  addFood.show();
  dog.display();
}

currentTime = hour();
if(currentTime === (lastFed + 1)){
  gameState = "playing";
  foodObj.gardens();
}else
if(currentTime === (lastFed + 2)){
  gameState = "sleeping";
  foodObj.bedrooms();
}else
if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
  gameState = "bathing";
  foodObj.washrooms();
}else
if(currentTime > (lastFed + 4) && currentTime <= (lastFed + 6)){
  gameState = "fun";
  foodObj.livrooms();
}
else{
  gameState = "hungry";
  foodObj.display();
}

//displaying the food
foodObj.display();

//displaying all the things on the screen
drawSprites();
}

//reading the foodstock from the database
function readStock(data){
  foodS = data.val();
  foodObj.updatefoodStock(foodS);
}

//feeding the dog when the feed dog button is pressed
//reducing the foodstock
//changing the image of the dog
//assigning the feedtime in hours only, it should show the time only in hours
function feedDog(){
  dog.addImage(dogimg2);
  foodObj.updatefoodStock(foodObj.getfoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getfoodStock(),
    FeedTime : hour()
  })
}

//function to add the food when the add food button is pressed
//increasing the food by 1, 1 extra milk will be displayed
function addFoods(){
  foodS ++;
  foodObj.updatefoodStock(foodObj.getfoodStock()+1);
  database.ref('/').update({
    Food : foodObj.getfoodStock()
  })
}
