---
date: 2012-11-20 21:42:00
layout: blog_entry
title: "Tux-Bubble a Cannon Ball clone"
tags:
- Tux-Bubble
- Game
summary: Play my JavaScript Cannon Ball clone in this post
---

<script>

var keys = [];
window.addEventListener("keydown",
    function(e){
        keys[e.keyCode] = true;
        switch(e.keyCode){
            case 37: case 39: case 38:  case 40: // Arrow keys
            case 32: e.preventDefault(); break; // Space
            default: break; // do not block other keys
        }
    },
false);
window.addEventListener('keyup',
    function(e){
        keys[e.keyCode] = false;
    },
false);

</script>

<h2>Tux Bubble</h2>

One of the arcade game that I really enjoyed playing was called *Pang* (more accurately *Super Pang*). This game was inspired the 1984 game called *Cannon Ball*, based on the simple concept of bouncing bubbles that you shoot creating smaller balls until too small to split. I knew this wouldn't work well hence I already have a video ready, so just see for yourself.

<iframe width="420" height="315" src="http://www.youtube.com/embed/FWF0y6foVM4" frameborder="0"> </iframe>

Cool right? So simple, yet so fun.

Anyway, I wanted to familiarise myself with some of the basic Javascript syntax so what better way to learn than getting stuck in and writing a game? There really was no thought or plan behind this, its just one hack after another and it shows; in chrome on mint 13 the images seem to have loading issues and will flash, in Firefox however it runs smoothly so I recommend trying Firefox if Chrome has issues for you.

<div class="section">

<a href="#1" class="showhide job_title lined"><h2>Try Tuxbubble v0.001</h2></a>

<div class="hide_this slickbox" id="1">

<p>

Controls are: Left arrow key and Right arrow key to move in respective directions. Enter to pause and unpause, getting hit by the bubble will pause the game.

</p>

<canvas id='c'>

</canvas>

<script src="/js/tuxbubble/newGame.js">

</script>

</div>

</div>

Current to-do list regarding this:

  - Refactor the whole code to make it cleaner and nicer.
  - Fix the glitch causing the balls to get stuck to the edge of the screen (this happens if the big bubble splits too close to the edge causing a newly created bubble to be produced outside of the screen)
  - Find a cheap server hosting to develop some kind of leader board.
  - Add a game menu.
  - Load images prior to play (so tux doesn't flash on initial load in chrome)

So there you go, if you have a go then post the score you get in the comments, currently my score high is 1290 lets see if you can beat it.
