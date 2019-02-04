class Greetings {
    english() {
        return "Hello";
    }
    spanish() {
        return "Hola";
    }
}
class CustomGreetings {
    german() {
        return "Hallo";
    }
    french() {
        return "Bonjour";
    }
}
const greetings = new Greetings();
const customGreetings = new CustomGreetings();
const allGreetings =  new Proxy(customGreetings, {
    get: function (target, property) {
        return target[property] || greetings[property]
    }
});
console.log(allGreetings.german());
console.log(allGreetings.english());