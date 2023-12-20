import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import { FRUITS } from "./fruits.js";

const runner = Runner.create();
const engine = Engine.create();
const render = Render.create({
  engine: engine,
  element: document.body, 
  options: { 
    wireframes: false,
    background: "#F7F4C8", // hex 코드
    width: 620,
    height: 850,
  }
});

const world = engine.world;


//좌 우 하단 벽
const leftWall = Bodies.rectangle(15, 395, 30, 790, { //matter-js는 중앙 점기준 위치를 정함
  isStatic: true,
  render: { fillStyle: "#E6B143"}
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143"}
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: { fillStyle: "#E6B143"}
});

//gameover라인
const topLine = Bodies.rectangle(310, 150, 620, 2, {
  isStatic: true, // 물리엔진 적용 제외, 고정
  isSensor : true, // 감지만 하는것
  render: { fillStyle: "#E6B143"},
  name: "topLine"
});


World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;
let interval = null;


function addFruit() {
  const index = Math.floor(Math.random() * 5);
  const fruit = FRUITS[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    index: index,
    isSleeping : true, // 바로 떨어지지않고 고정
    render: {
      sprite: { texture: `${fruit.name}.png` }
    },
    restitution: 0.3, //탄성
  });

  currentBody = body;
  currentFruit = fruit;
  

  World.add(world, body);

}
window.onkeydown = (event) => {
if(disableAction)
{
  return;
}

  switch(event.code) {
    case "ArrowLeft":
      if (interval)
        return;

      interval = setInterval(() => {
        if(currentBody.position.x - currentFruit.radius > 30)
        {
          Body.setPosition(currentBody, {
            x: currentBody.position.x - 1,
            y: currentBody.position.y,
          });
        }
      }, 5);
      
      break;
    case "ArrowRight":
      if (interval)
      return;

    interval = setInterval(() => {
      if(currentBody.position.x + currentFruit.radius < 590)
      {
        Body.setPosition(currentBody, {
          x: currentBody.position.x + 1,
          y: currentBody.position.y,
        });
      }
    }, 5);
      break;
    case "Space":
      currentBody.isSleeping = false;
      disableAction = true;
      setTimeout(() => {
        addFruit()
        disableAction = false;
      }, 1000);
      
      break;
  }
}

window.onkeyup = (event) => {
  switch (event.code){
    case "ArrowLeft":
    case "ArrowRight":
      clearInterval(interval);
      interval = null;
  }
}




//충돌판정 후 처리(다음 과일로 합체)
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if(collision.bodyA.index === collision.bodyB.index)
    {
      const index = collision.bodyA.index;

      if(index === FRUITS.length - 1)
      {
        return;
      }

      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newFruit = FRUITS[index +1];
      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: {
            sprite: { texture: `${newFruit.name}.png` }
          },
          index: index +1,
        }
      );

      World.add(world, newBody);

    }

    if(!disableAction && (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine"))
    {
      alert("Game over");
    }

  })
});

addFruit();

