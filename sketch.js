var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;

var obstaclesGroup, obstacle1;

var score = 0;

var gameOver, restart;

function preload() {
  trex_runnung = loadAnimation(
    "assets/trex1.png",
    "assets/trex2.png",
    "assets/trex3.png"
  );
  trex_collided = loadAnimation("assets/trex1.png");
  jungleImage = loadImage("assets/bg.png");
  food1 = loadImage("assets/meat1.png");
  food2 = loadImage("assets/meat2.png");
  food3 = loadImage("assets/meat3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400, 100, 400, 20);
  jungle.addImage("jungle", jungleImage);
  jungle.scale = 0.3;
  jungle.x = width / 2;

  trex = createSprite(50, 20, 20, 50);
  trex.addAnimation("running", trex_runnung);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.2;
  trex.setCollider("circle", 0, 0, 300);

  invisibleGround = createSprite(400, 350, 1600, 10);
  invisibleGround.visible = false;

  gameOver = createSprite(400, 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(550, 140);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;

  foodsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background(255);

  trex.x = camera.position.x - 270;

  if (gameState === PLAY) {
    jungle.velocityX = -3;

    if (jungle.x < 100) {
      jungle.x = 400;
    }
    console.log(trex.y);
    if (keyDown("space") && trex.y > 270) {
      jumpSound.play();
      trex.velocityY = -16;
    }

    trex.velocityY = trex.velocityY + 0.8;

    spawnFoods();
    spawnObstacles();

    trex.collide(invisibleGround);

    if (obstaclesGroup.isTouching(trex)) {
      collidedSound.play();
      gameState = END;
    }
    if (foodsGroup.isTouching(trex)) {
      score = score + 1;
      foodsGroup.destroyEach();
    }
  } else if (gameState === END) {
    gameOver.x = camera.position.x;
    restart.x = camera.position.x;
    gameOver.visible = true;
    restart.visible = true;

    trex.velocityY = 0;
    jungle.velocityX = 0;

    obstaclesGroup.setVelocityXEach(0);
    foodsGroup.setVelocityXEach(0);

    trex.changeAnimation("collided", trex_collided);

    obstaclesGroup.setLifetimeEach(-1);
    foodsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  } else if (gameState === WIN) {
    jungle.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    foodsGroup.setVelocityXEach(0);

    trex.changeAnimation("collided", trex_collided);

    obstaclesGroup.setLifetimeEach(-1);
    foodsGroup.setLifetimeEach(-1);
  }

  drawSprites();

  textSize(20);
  stroke(3);
  fill("black");
  text("Score: " + score, camera.position.x, 50);

  if (score >= 5) {
    trex.visible = false;
    textSize(30);
    stroke(3);
    fill("black");
    text("Congragulations!! You win the game!! ", 70, 200);
    gameState = WIN;
  }
}

function spawnFoods() {
  if (frameCount % 150 === 0) {
    var food = createSprite(camera.position.x + 500, 330, 40, 10);

    food.velocityX = -(6 + (3 * score) / 100);
    food.scale = 0.6;

    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        food.addImage(food1);
        break;
      case 2:
        food.addImage(food2);
        break;
      case 3:
        food.addImage(food3);
        break;
      default:
        break;
    }

    food.scale = 0.7;
    food.lifetime = 400;
    food.setCollider("rectangle", 0, 0, food.width / 2, food.height / 2);
    foodsGroup.add(food);
  }
}

function spawnObstacles() {
  if (frameCount % 120 === 0) {
    var obstacle = createSprite(camera.position.x + 400, 330, 40, 40);
    obstacle.setCollider("rectangle", 0, 0, 200, 200);
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + (3 * score) / 100);
    obstacle.scale = 0.15;
    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  trex.visible = true;
  trex.changeAnimation("running", trex_runnung);
  obstaclesGroup.destroyEach();
  foodsGroup.destroyEach();
  score = 0;
}
