// Set up canvas
const canvas = document.createElement("canvas");
var minigameCanvas = document.getElementById("minigame");
canvas.width = 350;
canvas.height = 400;
minigameCanvas.appendChild(canvas);
const ctx = canvas.getContext("2d");


// Player and Monster properties
let player = {
  x: 80,
  y: canvas.height - 100,
  size: 30,
  color: "pink",
  health: 50,
  projectiles: [],
};

let monster = {
  x: canvas.width - 70,
  y: 80,
  size: 50,
  color: "black",
  health: 100,
  projectiles: [],
};

let comboCounter = 0;

// Function to draw a circle
function drawCircle(x, y, size, color) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

// Function to draw health bar with name on top
function drawHealthBarWithLabel(x, y, width, height, health, maxHealth, color, label) {

  if(health >= 0){
    // Draw health bar
    const healthWidth = (health / maxHealth) * width;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, healthWidth, height);
  }

  // Draw health bar name on top
  ctx.fillStyle = "black";
  ctx.font = "14px Arial";
  const textWidth = ctx.measureText(label).width;
  ctx.fillText(label, x + (width - textWidth) / 2, y - 5);
}

// Function to draw combo counter
function drawComboCounter(x, y, combo) {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Combo: " + combo, x, y);
}

// Function to draw projectiles
function drawProjectiles(projectiles) {
  projectiles.forEach((projectile) => {
    drawCircle(projectile.x, projectile.y, 10, "black");
  });
}

// Function to move projectiles
function moveProjectiles(projectiles) {
  projectiles.forEach((projectile) => {
    projectile.x += projectile.speed;
    projectile.y -= projectile.speed;
  });
}

// Function to check for collisions between projectiles and target
function checkCollisions(projectiles, target) {
  projectiles.forEach((projectile, index) => {
    const distanceX = target.x + target.size / 2 - projectile.x;
    const distanceY = target.y + target.size / 2 - projectile.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance-30 < target.size / 2) {
      // Collision detected, reduce target health and remove the projectile
      target.health -= 10; // Adjust damage as needed

      if(target === player){
        document.body.style.transition = "0.5s";
        document.body.style.backgroundColor = "#ff0000";
        setTimeout(function () { document.body.style.transition = "0.5s"; document.body.style.backgroundColor = "white"; }, 1000);
        document.body.style.transition = "";
      }else if(target === monster){
        document.body.style.transition = "0.5s";
        document.body.style.backgroundColor = "#AAFF00";
        setTimeout(function () { document.body.style.transition = "0.5s"; document.body.style.backgroundColor = "white"; }, 1000);
        document.body.style.transition = "";
      }
      // Remove the projectile
      projectiles.splice(index, 1);

      document.body.style.transition = "";
    }
  });
}

var gameEnded = false;
// Function to check game state and display messages
function checkGameState() {
  if (monster.health <= 0) {
    canvas.style.display = "none";
    var h1 = document.createElement("h1");
    h1.innerHTML = "You Win!";
    minigameCanvas.appendChild(h1);
    gameEnded = true;

  } else if (player.health <= 0) {
    canvas.style.display = "none";
    var h1 = document.createElement("h1");
    h1.innerHTML = "You LOSE!";
    minigameCanvas.appendChild(h1);
    gameEnded = true;
  }
}

// Event listeners for True and False buttons
function playerAttack() {
  // Add projectile for player
  player.projectiles.push({
    x: player.x + player.size - 50,
    y: player.y + player.size + -10,
    speed: 4, // Adjust the speed as needed
  });

  comboCounter += 1;
  checkGameState();
}

function monsterAttack(){
  // Add projectile for monster
  monster.projectiles.push({
    x: monster.x,
    y: monster.y + monster.size / 2,
    speed: -4, // Adjust the speed as needed
  });

  comboCounter = 0; // Reset combo on false button click
  checkGameState();
}

// Update function
function update() {
  // Draw everything
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCircle(player.x, player.y, player.size, player.color);
  drawHealthBarWithLabel(player.x + player.size + 10, player.y - 30, 200, 30, player.health, 100, "green", "Player");

  drawCircle(monster.x, monster.y, monster.size, monster.color);
  drawHealthBarWithLabel(monster.x - 180, monster.y - 50, 200, 30, monster.health, 100, "red", "Monster");

  drawComboCounter(canvas.width - 150, canvas.height - 30, comboCounter);

      // Draw and move projectiles
      drawProjectiles(player.projectiles);
      drawProjectiles(monster.projectiles);
      moveProjectiles(player.projectiles);
      moveProjectiles(monster.projectiles);

      // Check for collisions between projectiles and targets
      checkCollisions(player.projectiles, monster);
      checkCollisions(monster.projectiles, player)

  // Request next frame
  requestAnimationFrame(update);
}

// Initial update
update();
