import { Player } from "./player.js";
import { Projecttile } from "./projectile.js";
import { Enemy } from "./enemy.js";
import { distanceBetweenTwoPoints } from "./utilities.js";

const canvas = document.querySelector("canvas");
const context = document.getContext("2d");
const a = document.querySelector(".score-wrap");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

const scoreEl = document.querySelector("#score");
const wastedElement = document.querySelector(".wasted");

let player;
let projectiles = [];
let enemies = [];
let particles = [];
let score = 0;
let annulation;
let countIntervalId;
let spawnIntervalId;
var audio = new Audio();
    audio.preload = "auto";
    audio.src = "shot.mp3";

var audioDeath = new Audio();
    audioDeath.preload = "auto";
    audioDeath.src = "death.mp3";

document.addEventListener("click", () => {
    audio = 0;
    audio = new Audio();
    audio.preload = "auto";
    audio.src = "shot.mp3";
    audio.play();
})

startGame ();
function startGame() {
    init();
    animate();
    spawnEnemies();
}

function init() {
    const monementLimits = {
        minX: 0,
        maxX: canvas.width,
        minY: 0,
        maxY: canvas.height,
    };
    player = new Player(canvas.width/2, canvas.height/2, context, movemntLimits);
    addEventListener("click", createProjectile);
}

function createProjectile(event) {
    projectiles.push(
    new projectiles(
        player.x,
        player.y,
        event.clientX,
        event.clientY
        )
    )
}

function spawnEnemies() {
    let countOfSpawnEnemies = 1;

    countIntervalId = setInterval(() => countOfSpawnEnemies++, 30000);
    spawnIntervalId = setInterval(() => spawnCountEnemies(countOfSpawnEnemies), 1000); //Можно изменять значение для того чтобы контроливать спавн врагов

    spawnCountEnemies(countOfSpawnEnemies);
}

function spawnCountEnemies(count) {
    for (let i = 0; i < count; i++) {
    enemies.push(new Enemy(canvas.width, canvas.height, context, player));
    }
}

function animate() {
    animationId = requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(particle => particle.alpha > 0);
    projectiles = projectiles.filter(projectileInsideWindow);
    enemies.forEach(enemy => checkHittingEnemies);
    enimies = enemies.filter(enemy = enemy.health > 0);
    const isGameOver = enemies.some(checkHittingEnemy) 
    if (isGameOver) {
        document.addEventListener("click", () => {
            audio.pause();
    })
    audioDeath.play();
    wastedElement.style.display = "block";
    clearInterval(countIntervalId);
    clearInterval(spawnIntervalId);
    cancelAnimationFrame(animationId);
    }

    particles.forEach(particle => particle.update());
    projectiles.forEach(projectile => projectile.update());
    player.update();
    enimies.forEach(enemy => enemy.update());
}

function projectileInsideWindow(projectile) {
    return projectile.x + projectile.radius > 0 &&
        projectile.x - projectile.radius < canvas.width &&
        projectile.y - projectile.radius > 0 &&
        projectile.y - projectile.radius < canvas.height
}

function checkHittingPlayer(enemy) {
    const distance = distanceBetweenTwoPoints(player.x, player.y, enemy.x, enemy.y);
    return distance -enemy.radius - player.radius < 0; 
}

function checkHittingEnemies(enemy) {
    projectiles.some((projectile, index) => {
        const distance = distanceBetweenTwoPoints(projectile.x, projectile.y, enemy.x, enemy.y);
        if (distance - enemy.radius - projectile.radius > 0) return false;

        removeProjectileByIndex(index);
        enemy.health--;

        if (enemy.health < 1) {
            increaseScore();
            enemy.createExplosion(particles);
        }

        return true;
    }) 
}

function removeProjectileByIndex(index) {
    projectiles.splice(index, 1);
}

function increaseScore() {
    score += 1;
    scoreEl.innerHTML = score;
}
