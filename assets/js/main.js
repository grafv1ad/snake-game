const X_AXIS = 6, Y_AXIS = 6; // Задаем размеры сетки

// Создаем "голову" и два элемента тела змеи
const snake = [
	document.createElement('div'),
	document.createElement('div'),
	document.createElement('div'),
];

const scoreForWin = X_AXIS * Y_AXIS - snake.length; // Расчитываем количество очков для победы
let currentScore = 0; // Задаем изначальное количество очков
let moveDirection = 'right'; // Задаем направление движения по умолчанию

// Запускаем игру
createGrid(); spawnSnake(); spawnFood(); cnageSnakeBodySizes();
const moveInterval = setInterval(moveSnake, 350);

// Выводим предупреждение, если юзер зашел с телефона
if (window.matchMedia('(max-width: 600px)').matches) {
	alert('Warning! The game is not supported on mobile devices');
}

function createGrid() {
	// Находим сетку и устанавливаем размеры
	const grid = document.querySelector('.grid');
	grid.style.gridTemplateColumns = `repeat(${X_AXIS}, 1fr)`;
	grid.style.gridTemplateRows = `repeat(${Y_AXIS}, 1fr)`;

	// Расчитываем площадь и задаем нулевые координаты
	const gridArea = X_AXIS * Y_AXIS;
	let x = 0, y = 0;

	// Перебираем все возможные координаты
	for (let i = 0; i < gridArea; i++) {
		if (x > X_AXIS - 1) { x = 0; y++; } // Переносим строку, когда доходим до конца оси X 

		// Создаем ячейку и задаем координаты
		const cell = document.createElement('div');
		cell.setAttribute('x', x); cell.setAttribute('y', y);
		cell.classList.add('cell');
		
		grid.appendChild(cell); // Переносим ячейку в сетку
		x++;
	}
}

function spawnSnake() {
	// Задаем классы
	snake[0].className = 'snake snake_head'; 
	snake[1].className = 'snake snake_body';
	snake[2].className = 'snake snake_body'; 

	// Получаем случайные координаты для "головы" змеи
	const posX = getRandomNumber(snake.length - 1, X_AXIS - 1), posY = getRandomNumber(1, Y_AXIS - 1);
	
	// Спавним элементы
	document.querySelector(`.cell[x="${posX}"][y="${posY}"]`).appendChild(snake[0]);
	document.querySelector(`.cell[x="${posX - 1}"][y="${posY}"]`).appendChild(snake[1]);
	document.querySelector(`.cell[x="${posX - 2}"][y="${posY}"]`).appendChild(snake[2]);
}

function spawnFood() {
	// Создаем элемент и задаем класс
	const food = document.createElement('div');
	food.className = 'food';

	const spawnPoint = getSpawnPoint(); // Получаем ячейку для спавна
	
	// Спавним элемент 
	spawnPoint.appendChild(food); 
	setTimeout(() => { food.style.transform = 'scale(1)'; }, 100);

	function getSpawnPoint() {
		// Получаем ячейку с случайными координатами
		const posX = getRandomNumber(0, X_AXIS - 1), posY = getRandomNumber(0, Y_AXIS - 1);
		let spawnPoint = document.querySelector(`.cell[x="${posX}"][y="${posY}"]`);

		// Вызываем функцию снова, если полученная ячейка НЕ пустая
		while (spawnPoint.childNodes.length !== 0) spawnPoint = getSpawnPoint();
		return spawnPoint;
	}
}

function getRandomNumber(min, max) {
	// Возвращаем рандомное число от min до max
	return Math.round(Math.random() * (max - min) + min);
}

function moveSnake() {
	// Находим координаты "головы" змеи
	const posX = +snake[0].parentNode.getAttribute('x'), posY = +snake[0].parentNode.getAttribute('y');

	snake[0].className = 'snake snake_body'; // Заменяем класс "head" на "body" у первого элемента 
	snake[snake.length - 1].remove(); snake.pop(); // Полностью удаляем последний элемент массива

	// Создаем новый элемент, вместо удаленного
	const snakeHead = document.createElement('div');
	snakeHead.className = 'snake snake_head';

	let inAction; // Переменная для предотвращения одновременного нажатия двух клавиш

	// Меняем направление движения в зависимости от нажатой клавиши
	document.addEventListener('keydown', (event) => {
		if (!inAction) {
			if ((event.code === 'ArrowRight' || event.code === 'KeyD') && moveDirection !== 'left') {
				moveDirection = 'right'; inAction = true;
			} else if ((event.code === 'ArrowLeft' || event.code === 'KeyA') && moveDirection !== 'right') {
				moveDirection = 'left'; inAction = true;
			} else if ((event.code === 'ArrowUp' || event.code === 'KeyW') && moveDirection !== 'down') {
				moveDirection = 'up'; inAction = true;
			} else if ((event.code === 'ArrowDown' || event.code === 'KeyS') && moveDirection !== 'up') {
				moveDirection = 'down'; inAction = true;
			}
		}
	});

	// Спавним новый элемент с условием, чтобы змея появлялась с другой стороны, когда доходит до края
	if (moveDirection === 'right') {
		if (posX < X_AXIS - 1) {
			document.querySelector(`.cell[x="${posX + 1}"][y="${posY}"]`).appendChild(snakeHead); 
		} else { document.querySelector(`.cell[x="${0}"][y="${posY}"]`).appendChild(snakeHead); }
	}
	if (moveDirection === 'left') {
		if (posX > 0) {
			document.querySelector(`.cell[x="${posX - 1}"][y="${posY}"]`).appendChild(snakeHead); 
		} else { document.querySelector(`.cell[x="${X_AXIS - 1}"][y="${posY}"]`).appendChild(snakeHead); }
	}
	if (moveDirection === 'up') {
		if (posY > 0) {
			document.querySelector(`.cell[x="${posX}"][y="${posY - 1}"]`).appendChild(snakeHead); 
		} else { document.querySelector(`.cell[x="${posX}"][y="${Y_AXIS - 1}"]`).appendChild(snakeHead); }
	}
	if (moveDirection === 'down') {
		if (posY < Y_AXIS - 1) {
			document.querySelector(`.cell[x="${posX}"][y="${posY + 1}"]`).appendChild(snakeHead); 
		} else { document.querySelector(`.cell[x="${posX}"][y="${0}"]`).appendChild(snakeHead); }
	}

	inAction = false;
	snake.unshift(snakeHead); // Переносим новый элемент в начало массива
	cnageSnakeBodySizes(); // Вызываем функцию для динамического размера тела змеи
	snakeInteractions(snakeHead); // Вызываем функцию для взаимодействия змеи с другими элементами
}

function cnageSnakeBodySizes() {
	// Перебираем массив с телом змеи
	for (i = 0; i < snake.length; i++) {
		// Уменьшаем размер элементов тела в зависимости от порядкого номера в массиве
		let scale = (100 - i * 5) / 100;
		if (scale >= 0.4) {
			snake[i].style.transform = `scale(${scale})`
		}
	}
}

function snakeInteractions(snakeHead) {
	const cell = snakeHead.parentNode; // Получаем ячейку в которой находится "голова"

	// Проверяем есть ли еще елемент в этой ячейке
	if (cell.childNodes.length === 2) {
		// Если это еда
		if (cell.firstChild.classList.contains('food')) {
			// Удаляем и снова спавним еду
			cell.firstChild.remove();
			spawnFood();

			updateCurrentScore(); // Добавляем +1 к очкам

			// Удлиняем хвост у змеи
			const tail = document.createElement('div');
			tail.className = 'snake snake_body';  
			snake.push(tail);
		} 
		// Если это часть змеи
		else if (cell.firstChild.classList.contains('snake')) {
			clearInterval(moveInterval); // Останавливаем движение змеи
			cell.firstChild.remove(); // Удаляем часть в которую "врезались"
			document.querySelector('.game-over_lose').style.display = 'block'; // Выводим сообщение
		}
	}
}

function updateCurrentScore() {
	// Находим счетчик очков и добавляем +1
	document.querySelector('.score__counter').textContent = ++currentScore;

	// Если набрано нужное количество очков для победы
	if (currentScore === scoreForWin) {
		clearInterval(moveInterval); // Останавливаем движение змеи
		document.querySelector('.food').remove(); // Удаляем последнюю еду с поля
		document.querySelector('.game-over_win').style.display = 'block'; // Выводим сообщение
	}
}