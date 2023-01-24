const slider = tns({
    container: ".my-slider",
    mode:"carousel",
    items:3,
    responsive:{
      768:{
        items:3
      },
      480:{
        items:2

      }
    },
    edgePadding:0,
    slideBy: "page",
    speed:7000,
    nav:false,
    navPosition:"top",
    autoplay:false,
    autoplayTimeout:7000,
    autoplayButtonOutput:false,
    controlsContainer: "#buttons",
    prevButton:".previous",
    nextButton:".next",
    

  });


