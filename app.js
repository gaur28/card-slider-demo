const slider = tns({
    container: ".my-slider",
    mode:"carousel",
    items:3,
    edgePadding:-10,
    slideBy: "page",
    speed:7000,
    nav:true,
    navPosition:"top",
    autoplay:false,
    autoplayTimeout:7000,
    autoplayButtonOutput:false,
    controlsContainer: "#buttons",
    prevButton:".previous",
    nextButton:".next"
  });


