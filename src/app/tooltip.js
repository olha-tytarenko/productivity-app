import jQuery from 'jquery';

(function ($) {
  const tooltipNode = document.createElement('div');
  tooltipNode.classList.add('tooltip');
  document.body.appendChild(tooltipNode);

  $.fn.tooltip = function () { 
    $('.tooltip').hide();

    this.mouseenter(function(event) {
      const tooltipMessage = event.target.dataset.tooltip;
      tooltipNode.innerText = tooltipMessage;
      $('.tooltip').show();
    });

    this.mouseleave(function() {
      $('.tooltip').hide();
    });

    this.mousemove(function(event) {
      $('.tooltip').css({'top': event.pageY + 25, 'left': event.pageX - 10});
    });
  };
})(jQuery);

