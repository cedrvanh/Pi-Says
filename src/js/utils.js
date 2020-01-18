export const delay = 500;

export const getRandomNumber = () => Math.floor(Math.random() * 4);

// Adds button active state
export const toggleButton = (id, color) => {
    const button = document.getElementById(`${id}`);
    toggleClass(button, `${color}--active`);
    setTimeout(() => toggleClass(button, `${color}--active`), delay);
}

// Toggle element class name
export const toggleClass = (element, className) => {
    element.classList.toggle(`${className}`);
};

// Returns button color by ID
// Green = 0, Red = 1, Yellow = 2, Blue = 3
export const getColorById = (id) => {
    let color;
    switch (id) {
        case 0:
            color = 'green';
            break;
        case 1:
            color = 'red';
            break;
        case 2:
            color = 'yellow';
            break;
        case 3:
            color = 'blue';
            break;
        default:
            break;
    }
    return color;
}