const facts = [
  "Cats have over 20 different sounds!",
  "A cat's purr helps heal bones ❤️‍🩹",
  "Cats spend 70% of their lives sleeping  💤",
  "Cats can rotate their ears 180 degrees!",
  "Cats can jump up to 5x their height!",
  "Every cat's noseprint is unique!",
  "Cats can run up to 30mph!",
  "Cats spend about 30-50% of their time awake grooming themselves!",
  "A group of cats is called a clowder 🐱🐱🐱",
  "Cats can't taste sweetness.",
  "Owning a cat can reduce the risk of a heart attack by 33.33%!",
  "Most adult cats are lactose intolerant.",
  "Black cats are good luck in the United Kingdom and Australia! 🐈‍⬛"
];

window.addEventListener('load', function() {
  document.getElementById('catFact').textContent = facts[Math.floor(Math.random() * facts.length)];
});