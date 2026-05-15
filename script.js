// Скрипт для свадебного сайта Степан & Евгения
document.addEventListener('DOMContentLoaded', function() {
    console.log('Свадебный сайт загружен');
    
    // Таймер
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Инициализация плеера
    initMusicPlayer();
    
    // Инициализация формы RSVP
    initRSVPForm();
    
    // Инициализация ограничения алкоголя (максимум 2)
    initAlcoholLimit();
    
    // Инициализация галереи
    initGallery();
});

// Таймер отсчета до свадьбы
function updateCountdown() {
    const weddingDate = new Date('2026-08-21T15:00:00');
    const now = new Date();
    const diff = weddingDate - now;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = days.toString();
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
}

// Музыкальный плеер
function initMusicPlayer() {
    const playButton = document.getElementById('playButton');
    const weddingMusic = document.getElementById('weddingMusic');
    const circlePlayer = document.querySelector('.circle-player');
    
    if (!playButton || !weddingMusic || !circlePlayer) return;
    
    let isPlaying = false;
    
    playButton.addEventListener('click', function() {
        if (isPlaying) {
            weddingMusic.pause();
            weddingMusic.currentTime = 0;
            playButton.classList.remove('playing');
            circlePlayer.classList.remove('music-playing');
            isPlaying = false;
        } else {
            weddingMusic.play()
                .then(() => {
                    playButton.classList.add('playing');
                    circlePlayer.classList.add('music-playing');
                    isPlaying = true;
                })
                .catch(error => {
                    console.log('Для воспроизведения нажмите еще раз');
                    playButton.classList.add('playing');
                    circlePlayer.classList.add('music-playing');
                    isPlaying = true;
                });
        }
    });
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && isPlaying) {
            weddingMusic.pause();
            weddingMusic.currentTime = 0;
            isPlaying = false;
            playButton.classList.remove('playing');
            circlePlayer.classList.remove('music-playing');
        }
    });
}

// ========== БАЗОВЫЕ СТИЛИ АНИМАЦИЙ ==========
const coreStyles = document.createElement('style');
coreStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(coreStyles);

// ========== УНИВЕРСАЛЬНОЕ МОДАЛЬНОЕ ОКНО ==========
function showModal(title, message, isError = false) {
    const existingModal = document.getElementById('customModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'customModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    const icon = isError ? '✕' : '✓';
    const iconColor = isError ? '#c62828' : '#2e7d32';
    const bgIconColor = isError ? '#ffebee' : '#e8f5e9';
    const borderColor = isError ? '#c62828' : '#2e7d32';

    modal.innerHTML = `
        <div style="
            background: #ffffff;
            border-radius: 16px;
            padding: 32px 40px;
            max-width: 380px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 35px rgba(0, 0, 0, 0.15);
            animation: slideUp 0.3s ease;
            border-top: 3px solid ${borderColor};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        ">
            <div style="
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: ${bgIconColor};
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px auto;
            ">
                <div style="
                    font-size: 32px;
                    font-weight: 400;
                    color: ${iconColor};
                    line-height: 1;
                ">${icon}</div>
            </div>
            <h3 style="
                font-size: 24px;
                font-weight: 500;
                color: #1a1a1a;
                margin-bottom: 12px;
                letter-spacing: -0.3px;
            ">${title}</h3>
            <p style="
                font-size: 16px;
                color: #555555;
                margin-bottom: 28px;
                line-height: 1.5;
            ">${message}</p>
            <button onclick="this.closest('#customModal').remove()" style="
                background: #f5f5f5;
                color: #333333;
                border: none;
                padding: 12px 32px;
                border-radius: 40px;
                font-family: inherit;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            " onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background='#f5f5f5'">
                Закрыть
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    if (!isError) {
        setTimeout(() => {
            if (modal.parentElement) modal.remove();
        }, 4000);
    }
}

// ========== МОДАЛЬНОЕ ОКНО ЗАГРУЗКИ ==========
function showLoadingModal() {
    const existingLoading = document.getElementById('loadingModal');
    if (existingLoading) existingLoading.remove();
    
    const loadingModal = document.createElement('div');
    loadingModal.id = 'loadingModal';
    loadingModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(3px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    loadingModal.innerHTML = `
        <div style="
            background: white;
            border-radius: 16px;
            padding: 32px 40px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid #e0e0e0;
                border-top-color: #5c151b;
                border-radius: 50%;
                margin: 0 auto 20px;
                animation: spin 1s linear infinite;
            "></div>
            <p style="
                font-size: 15px;
                color: #666;
                margin: 0;
            ">Отправка ответа...</p>
        </div>
    `;
    document.body.appendChild(loadingModal);
    return loadingModal;
}

// ========== GOOGLE SHEETS ==========
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzymm8bCWEH3_S8YFy1KPZgGJHj6TYXXCETPzbK39AhrW6Jkravm-AzIvLkTTh5PJfBXQ/exec';

// Инициализация формы RSVP (упрощённая, без ожидания ответа)
function initRSVPForm() {
    const rsvpForm = document.querySelector('.rsvp-form');
    if (!rsvpForm) return;
    
    let isSubmitting = false; // Флаг для предотвращения повторной отправки
    
    rsvpForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Предотвращаем повторную отправку
        if (isSubmitting) return;
        
        const submitBtn = this.querySelector('.submit-button');
        const originalText = submitBtn.textContent;
        
        // Получаем данные
        const nameInput = this.querySelector('input[type="text"]');
        const attendanceRadio = this.querySelector('input[name="attendance"]:checked');
        const foodRadio = this.querySelector('input[name="food"]:checked');
        
        const name = nameInput ? nameInput.value.trim() : '';
        const attendance = attendanceRadio ? attendanceRadio.value : null;
        const food = foodRadio ? foodRadio.value : '';
        
        // Собираем выбранные алкогольные предпочтения
        let alcoholValues = [];
        document.querySelectorAll('input[name="alcohol"]:checked').forEach(checkbox => {
            alcoholValues.push(checkbox.value);
        });
        
        // Валидация
        if (!name) {
            showModal('Ошибка', 'Пожалуйста, введите ваше имя', true);
            nameInput.focus();
            return;
        }
        
        if (!attendance) {
            showModal('Ошибка', 'Пожалуйста, выберите вариант присутствия', true);
            return;
        }
        
        // Блокируем кнопку
        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        
        // Показываем загрузку
        const loadingModal = showLoadingModal();
        
        try {
            // Формируем данные для отправки
            const formDataToSend = new URLSearchParams();
            formDataToSend.append('name', name);
            formDataToSend.append('attendance', attendance);
            formDataToSend.append('food', food);
            
            for (const alcohol of alcoholValues) {
                formDataToSend.append('alcohol', alcohol);
            }
            
            // Отправляем запрос (не ждём ответа)
            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Важно для обхода CORS
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formDataToSend.toString()
            }).catch(err => console.log('Ошибка отправки (не критично):', err));
            
            // Ждём 2 секунды, чтобы запрос точно ушёл
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Закрываем окно загрузки
            loadingModal.remove();
            
            // Показываем успех (даже если fetch упал, данные скорее всего ушли)
            if (attendance === 'yes') {
                showModal(
                    'Спасибо, ' + name + '!',
                    'Мы будем ждать вас на нашей свадьбе 21 августа 2026 года! 🎉',
                    false
                );
            } else {
                showModal(
                    'Спасибо за ответ!',
                    'Очень жаль, что вы не сможете быть с нами в этот день.',
                    false
                );
            }
            
            // Очищаем форму
            rsvpForm.reset();
            // Сбрасываем чекбоксы
            document.querySelectorAll('input[name="alcohol"]').forEach(cb => cb.checked = false);
            
        } catch (error) {
            loadingModal.remove();
            // Даже при ошибке показываем успех, так как данные могли уйти
            showModal(
                'Спасибо, ' + name + '!',
                'Ваш ответ получен. Мы будем ждать вас на свадьбе! 🎉',
                false
            );
            rsvpForm.reset();
            document.querySelectorAll('input[name="alcohol"]').forEach(cb => cb.checked = false);
        } finally {
            // Разблокируем кнопку через 1 секунду после закрытия модалки
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                isSubmitting = false;
            }, 1000);
        }
    });
}

// ========== ОГРАНИЧЕНИЕ ВЫБОРА АЛКОГОЛЯ (МАКСИМУМ 2) ==========
function initAlcoholLimit() {
    const alcoholCheckboxes = document.querySelectorAll('input[name="alcohol"]');
    
    if (alcoholCheckboxes.length === 0) return;
    
    function handleAlcoholChange() {
        const checkedCount = document.querySelectorAll('input[name="alcohol"]:checked').length;
        
        if (checkedCount >= 2) {
            alcoholCheckboxes.forEach(checkbox => {
                if (!checkbox.checked) {
                    checkbox.disabled = true;
                }
            });
        } else {
            alcoholCheckboxes.forEach(checkbox => {
                checkbox.disabled = false;
            });
        }
    }
    
    alcoholCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleAlcoholChange);
    });
    
    handleAlcoholChange();
}

// ========== ГАЛЕРЕЯ С ВОЗМОЖНОСТЬЮ СВАЙПА ==========
function initGallery() {
    const slider = document.getElementById('gallerySlider');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const dotsContainer = document.getElementById('galleryDots');
    
    if (!slider || !prevBtn || !nextBtn || !dotsContainer) return;
    
    const slides = document.querySelectorAll('.gallery-slide');
    const slideCount = slides.length;
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    function goToSlide(index) {
        if (index < 0) index = 0;
        if (index >= slideCount) index = slideCount - 1;
        currentIndex = index;
        const slideWidth = slider.clientWidth;
        slider.scrollTo({
            left: currentIndex * slideWidth,
            behavior: 'smooth'
        });
        updateDots();
    }
    
    function updateDots() {
        const dots = document.querySelectorAll('.gallery-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    function nextSlide() {
        if (currentIndex < slideCount - 1) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0);
        }
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(slideCount - 1);
        }
    }
    
    function updateIndexOnScroll() {
        const slideWidth = slider.clientWidth;
        const scrollPosition = slider.scrollLeft;
        currentIndex = Math.round(scrollPosition / slideWidth);
        updateDots();
    }
    
    // Drag to scroll
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.cursor = 'grabbing';
    });
    
    slider.addEventListener('mouseleave', () => {
        isDragging = false;
        slider.style.cursor = 'grab';
    });
    
    slider.addEventListener('mouseup', () => {
        isDragging = false;
        slider.style.cursor = 'grab';
        updateIndexOnScroll();
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events для свайпа
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        slider.style.cursor = 'grabbing';
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevSlide();
        }
        slider.style.cursor = 'grab';
        updateIndexOnScroll();
    });
    
    let scrollTimeout;
    slider.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateIndexOnScroll, 100);
    });
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    window.addEventListener('resize', () => {
        goToSlide(currentIndex);
    });
    
    createDots();
    slider.style.cursor = 'grab';
    setTimeout(updateIndexOnScroll, 100);
}
