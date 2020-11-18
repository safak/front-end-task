Make the logo great again

[👉DEMO LINK](https://zoovu.herokuapp.com)

<img src="https://github.com/safak/front-end-task/blob/master/zoovu.gif" data-canonical-src="https://github.com/safak/front-end-task/blob/master/zoovu.gif" width="400"/>

## Sum up

This application created with React.js with functional components using hooks.
Application starts with [welcome screen](https://github.com/safak/front-end-task/blob/master/src/pages/Welcome.js) after clicking "start" button, [game area](https://github.com/safak/front-end-task/blob/master/src/pages/Game.js) shows up. It contains [CardGroup](https://github.com/safak/front-end-task/blob/master/src/components/CardGroup.js) component which includes the whole drag drop processes.

- The game starts with an empty user array and random shuffled main array.
- Score starts counting after clicking any cards and activates "isStarted" value.
- If a card goes a empty area on user array, it means a new movement.
- Logsaw checks every movement. If movement card doesn't match with the same posiion item in the main array, Logsaw adds 10 more additional seconds.
- When every position letters match each other, game ends and starts again after 10 seconds with same user.
