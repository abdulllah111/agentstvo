$(document).ready(function() {
  // Плавный скроллинг для всех ссылок с якорями и кнопок с data-href
  $('a[href^="#"], button[data-href]').on('click', function(e) {
    e.preventDefault();
    const targetId = $(this).attr('href') || $(this).data('href');
    const target = $(targetId);
    
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top - 80 // Отступ для фиксированного меню
      }, 1200, 'swing', function() {
        // После завершения анимации добавляем хэш в URL
        window.location.hash = targetId;
      });
    }
  });

  // Анимация меню при скролле
  let lastScroll = 0;
  const header = $('.header');
  const scrollThreshold = 100;

  $(window).scroll(function() {
    const currentScroll = $(this).scrollTop();
    
    // Показываем/скрываем меню в зависимости от направления скролла
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      // Скролл вниз
      header.addClass('header-hidden').removeClass('header-visible');
    } else {
      // Скролл вверх
      header.removeClass('header-hidden').addClass('header-visible');
    }
    
    // Добавляем класс для изменения фона при скролле
    if (currentScroll > 50) {
      header.addClass('scrolled');
    } else {
      header.removeClass('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // Анимация появления элементов при скролле
  const animateOnScroll = function() {
    $('.animate-on-scroll').each(function() {
      const elementTop = $(this).offset().top;
      const elementBottom = elementTop + $(this).outerHeight();
      const viewportTop = $(window).scrollTop();
      const viewportBottom = viewportTop + $(window).height();

      if (elementBottom > viewportTop && elementTop < viewportBottom) {
        $(this).addClass('animated');
      }
    });
  };

  // Добавляем класс для анимации элементам
  $('.service-card, .portfolio-item, .team-member, .stat-item').addClass('animate-on-scroll');

  // Запускаем анимацию при скролле
  $(window).on('scroll', animateOnScroll);
  // Запускаем анимацию при загрузке страницы
  animateOnScroll();

  
  // Анимация счетчиков в секции "О нас"
  const animateCounter = function() {
    $('.stat-number').each(function() {
      const $this = $(this);
      // Проверяем, не был ли счетчик уже запущен
      if ($this.data('counted')) return;
      
      const target = parseInt($this.data('target'));
      if (isNaN(target)) return;
      
      $({ countNum: 0 }).animate({
        countNum: target
      }, {
        duration: 3000,
        easing: 'swing',
        step: function() {
          $this.text(Math.floor(this.countNum) + '+');
        },
        complete: function() {
          $this.text(this.countNum + '+');
          $this.data('counted', true);
        }
      });
    });
  };

  // Запускаем анимацию счетчиков при их появлении в viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  $('.stat-item').each(function() {
    observer.observe(this);
  });

  // Анимация при наведении на карточки услуг
  $('.service-card').hover(
    function() {
      $(this).find('i').addClass('fa-bounce');
    },
    function() {
      $(this).find('i').removeClass('fa-bounce');
    }
  );

  // Анимация при наведении на портфолио
  $('.portfolio-item').hover(
    function() {
      $(this).find('.portfolio-overlay').css('opacity', '1');
    },
    function() {
      $(this).find('.portfolio-overlay').css('opacity', '0');
    }
  );

  // Mobile menu functionality
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  let lastScrollTop = 0;

  if (mobileMenuButton && mobileMenu) {
    // Toggle menu on button click
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });

    // Close menu when scrolling
    window.addEventListener('scroll', () => {
      if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
      }
    });
  }

  // Анимация параллакса для hero секции
  $(window).scroll(function() {
    const scrolled = $(window).scrollTop();
    $('.hero').css('background-position-y', -(scrolled * 0.5) + 'px');
  });

  // Portfolio filter
  $('.portfolio-filter button').on('click', function() {
    const filter = $(this).data('filter');
    
    $('.portfolio-filter button').removeClass('active');
    $(this).addClass('active');

    if (filter === 'all') {
      $('.portfolio-item').fadeIn(300);
    } else {
      $('.portfolio-item').hide();
      $('.portfolio-item[data-category="' + filter + '"]').fadeIn(300);
    }
  });

  // Form validation and submission
  $('.contact-form').on('submit', function(e) {
    e.preventDefault();
    
    const form = $(this);
    const submitButton = form.find('button[type="submit"]');
    
    // Basic validation
    let isValid = true;
    form.find('input, textarea').each(function() {
      if (!$(this).val()) {
        isValid = false;
        $(this).addClass('error');
      } else {
        $(this).removeClass('error');
      }
    });

    if (isValid) {
      submitButton.prop('disabled', true).text('Отправка...');
      
      // Simulate form submission (replace with actual AJAX call)
      setTimeout(function() {
        form.find('input, textarea').val('');
        submitButton.prop('disabled', false).text('Отправить');
        alert('Спасибо! Ваше сообщение отправлено.');
      }, 1500);
    }
  });

  // Team member hover effect
  $('.team-member').hover(
    function() {
      $(this).find('img').addClass('hover');
    },
    function() {
      $(this).find('img').removeClass('hover');
    }
  );

  // Form handling
  $('.send_request').click(function(event) {
    event.preventDefault();
    event.stopPropagation();

    var error_count = 0;

    $('.reqfield').each(function() {
      var em = $(this);
      var value = em.val();

      if (value === '') {
        em.css('border-color', 'red');
        em.parent().find('.input-group-text').css({
          'background-color': 'rgb(245, 0, 4)',
          'border': '1px solid rgb(245, 0, 4)'
        });
        em.parent().parent().find('.invalid-feedback').show();
        error_count++;
      } else {
        em.css('border-color', '#ced4da');
        em.parent().find('.input-group-text').css({
          'background-color': 'rgb(0, 0, 0)',
          'border': '1px solid rgb(0, 0, 0)'
        });
        em.parent().parent().find('.invalid-feedback').hide();
      }

      if (em.attr('name') === 'policy') {
        if (!em.is(':checked')) {
          $('.custom-control-label').addClass('danger');
          em.parent().parent().find('.invalid-feedback').show();
          error_count++;
        } else {
          $('.custom-control-label').removeClass('danger');
          em.parent().parent().find('.invalid-feedback').hide();
        }
      }
    });

    if (error_count === 0) {
      var sendform = $('.send_request');
      sendform.attr('disabled', true);
      sendform.text('Отправление...');

      var formData = new FormData($('#send_form')[0]);
      
      // Здесь нужно добавить URL для отправки формы
      $.ajax({
        url: '/telegram/send_alert.php',
        type: 'POST',
        processData: false,
        contentType: false,
        cache: false,
        data: formData,
        success: function(msg) {
          if (msg == 'ok') {
            $('#feedback_parent').html(`
              <div class="success_mess">
                Заявка успешно отправлена, мы свяжемся с Вами в ближайшее время!
                <div>
                  <button name="submit" class="btn btn-primary back_to_site">
                    <i class="fas fa-arrow-left"></i> Вернуться на сайт
                  </button>
                </div>
              </div>
            `);
          }
        },
        error: function() {
          sendform.attr('disabled', false);
          sendform.text('Отправить');
          alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
        }
      });
    }
  });

  $(document).on('click', '.back_to_site', function() {
    location.reload();
  });
});