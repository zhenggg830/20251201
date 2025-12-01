let spriteSheetRun;     
let spriteSheetJump;    

// ALL1 參數 (行走)
const RUN_SHEET_WIDTH = 373;
const RUN_FRAME_HEIGHT = 94;
const RUN_FRAME_COUNT = 7;
const RUN_FRAME_WIDTH = RUN_SHEET_WIDTH / RUN_FRAME_COUNT; 

// ALL2 參數 (跳躍)
const JUMP_SHEET_WIDTH = 223;
const JUMP_FRAME_HEIGHT = 96; 
const JUMP_FRAME_COUNT = 4;
const JUMP_FRAME_WIDTH = JUMP_SHEET_WIDTH / JUMP_FRAME_COUNT; 

const SCALE_FACTOR = 1.2; // 放大 20%

let characterX;         
let characterY;         
let groundY;            

let currentFrame = 0;   
let isMoving = false;   
let isJumping = false;  

let direction = 1;      

const MOVE_SPEED = 3;   
const JUMP_HEIGHT = 80; 
let jumpStep = 0;       

// --- Preload: 載入資源 ---
function preload() {
  spriteSheetRun = loadImage('N1/ALL1.png'); 
  spriteSheetJump = loadImage('N1/ALL2.png'); 
}

// --- Setup: 初始化設定 ---
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(15);
  
  // ⭐ 修正: 將地面/原始Y座標設為畫布高度的一半 (垂直置中)
  groundY = height / 2; 
  characterX = width / 2;
  characterY = groundY;
}

// --- Draw: 每幀繪製 ---
function draw() {
  background('#e2eafc'); 

  if (isJumping) {
    handleJump();
  } else if (isMoving) {
    characterX += MOVE_SPEED * direction;
    currentFrame = (floor(frameCount / 4) % RUN_FRAME_COUNT); 
  } else {
    currentFrame = 0;
  }
  
  const boundaryOffset = RUN_FRAME_WIDTH * SCALE_FACTOR / 2;
  characterX = constrain(characterX, boundaryOffset, width - boundaryOffset);

  drawCharacter();
}

// --- 處理跳躍邏輯 ---
function handleJump() {
  const maxSteps = JUMP_FRAME_COUNT * 2; 
  const stepDistance = JUMP_HEIGHT / (maxSteps / 2); 

  if (jumpStep >= maxSteps) {
      characterY = groundY; 
      isJumping = false;    
      jumpStep = 0;         
      return;
  }

  if (jumpStep < maxSteps / 2) { 
    characterY -= stepDistance;
  } else { 
    characterY += stepDistance;
  }
  
  currentFrame = floor(jumpStep / 2) % JUMP_FRAME_COUNT;
  jumpStep++;
}

// --- 繪製角色 (包含翻轉邏輯和縮放) ---
function drawCharacter() {
  push(); 

  translate(characterX, characterY);
  scale(direction, 1); 

  let img, frameW, frameH, sourceX;
  let dWidth, dHeight; 

  if (isJumping) {
    img = spriteSheetJump;
    frameW = JUMP_FRAME_WIDTH;
    frameH = JUMP_FRAME_HEIGHT;
    sourceX = currentFrame * JUMP_FRAME_WIDTH;
  } else {
    img = spriteSheetRun;
    frameW = RUN_FRAME_WIDTH;
    frameH = RUN_FRAME_HEIGHT;
    sourceX = currentFrame * RUN_FRAME_WIDTH;
  }
  
  dWidth = frameW * SCALE_FACTOR;
  dHeight = frameH * SCALE_FACTOR;
  
  image(
    img, 
    -dWidth / 2,         
    -dHeight / 2,        
    dWidth,              
    dHeight,             
    sourceX, 
    0, 
    frameW,              
    frameH               
  );

  pop(); 
}

// --- Key Pressed: 處理按鍵按下事件 ---
function keyPressed() {
  if (!isJumping) {
    if (keyCode === RIGHT_ARROW) {
      isMoving = true;
      direction = 1; 
    } else if (keyCode === LEFT_ARROW) {
      isMoving = true;
      direction = -1; 
    } else if (keyCode === UP_ARROW) {
      isJumping = true;
      isMoving = false; 
    }
  }
}

// --- Key Released: 處理按鍵釋放事件 ---
function keyReleased() {
  if (!isJumping) {
    if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
      if (!keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW)) {
          isMoving = false;
      }
    }
  }
}

// --- Window Resized: 調整畫布大小 ---
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // ⭐ 修正: 重新設定地面位置為新的垂直置中
  groundY = height / 2; 
  if (!isJumping) {
    characterY = groundY;
  }
}