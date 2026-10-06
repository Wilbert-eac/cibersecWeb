/**
 * SENTINEL - Cybersecurity & Continuity Landing Page Logic
 * Contains: Particles background, Scroll animations, Versus slider, Solutions tabs, FAQ accordion, Quiz modal.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ---------------------------------------------------------
    // 1. PARTICLES CANVAS BACKGROUND
    // ---------------------------------------------------------
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        // Determine particle density based on device screen size
        const getParticleCount = () => {
            return window.innerWidth < 768 ? 40 : 80;
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            constructor() {
                this.reset(true);
            }

            reset(init = false) {
                this.x = Math.random() * canvas.width;
                this.y = init ? Math.random() * canvas.height : (Math.random() > 0.5 ? -10 : canvas.height + 10);
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.8 + 0.8;
                this.alpha = Math.random() * 0.4 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around edges slightly padded
                if (this.x < -20 || this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20) {
                    this.reset(false);
                }

                // Mouse interaction (slight push away)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x += (dx / dist) * force * 0.8;
                        this.y += (dy / dist) * force * 0.8;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 92, 246, ${this.alpha})`;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const count = getParticleCount();
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        const drawConnections = () => {
            const maxDistance = 110;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

                    if (dist < maxDistance) {
                        const alpha = (1 - dist / maxDistance) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw radial glow in the center for depth
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 10,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
            );
            gradient.addColorStop(0, '#0d0b17');
            gradient.addColorStop(1, '#06050a');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawConnections();
            requestAnimationFrame(animate);
        };

        // Event listeners
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Start Canvas
        resizeCanvas();
        animate();
    }

    // ---------------------------------------------------------
    // 2. HEADER SCROLL & MOBILE NAVIGATION DRAWER
    // ---------------------------------------------------------
    const header = document.querySelector('.main-header');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Header scroll background toggle
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            mobileNav.classList.add('open');
        });
    }

    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });
    });

    // ---------------------------------------------------------
    // 3. ONE-PAGE SCROLLSPY (ACTIVE LINK HIGHLIGHTING)
    // ---------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const scrollActive = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            // Offset calculation to trigger a bit before the section hits top
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            const correspondingLinks = document.querySelectorAll(`.nav-menu a[href*=${sectionId}], .mobile-nav-links a[href*=${sectionId}]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                correspondingLinks.forEach(link => link.classList.add('active'));
            } else {
                correspondingLinks.forEach(link => link.classList.remove('active'));
            }
        });
    };
    window.addEventListener('scroll', scrollActive);

    // ---------------------------------------------------------
    // 4. STATS COUNTER ANIMATION
    // ---------------------------------------------------------
    const statsNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000; // ms
        const stepTime = 20; // ms
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                // Ensure exactly target is displayed at the end
                if (target >= 1000) {
                    // Format big numbers with commas
                    el.textContent = target.toLocaleString('es-MX') + suffix;
                } else {
                    el.textContent = target + suffix;
                }
                clearInterval(timer);
            } else {
                const displayVal = Math.floor(current);
                if (target >= 1000) {
                    el.textContent = displayVal.toLocaleString('es-MX') + suffix;
                } else {
                    el.textContent = displayVal + suffix;
                }
            }
        }, stepTime);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numEl = entry.target.querySelector('.stat-number');
                if (numEl) {
                    animateCounter(numEl);
                }
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, { threshold: 0.25 });

    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => statsObserver.observe(card));

    // ---------------------------------------------------------
    // 5. INTERACTIVE BEFORE/AFTER SLIDER (VERSUS)
    // ---------------------------------------------------------
    const sliderContainer = document.getElementById('versus-slider');
    const handle = document.querySelector('.slider-handle');
    let isSliding = false;

    if (sliderContainer && handle) {
        const updateSlider = (clientX) => {
            const rect = sliderContainer.getBoundingClientRect();
            let x = clientX - rect.left;
            
            // Constrain between 5% and 95% to avoid losing handles or weird boundaries
            let percentage = (x / rect.width) * 100;
            if (percentage < 5) percentage = 5;
            if (percentage > 95) percentage = 95;

            sliderContainer.style.setProperty('--split-percent', `${percentage}%`);
        };

        const startSlide = () => { isSliding = true; };
        const stopSlide = () => { isSliding = false; };

        // Mouse Events
        handle.addEventListener('mousedown', startSlide);
        window.addEventListener('mouseup', stopSlide);
        window.addEventListener('mousemove', (e) => {
            if (!isSliding) return;
            updateSlider(e.clientX);
        });

        // Touch Events (Mobile support)
        handle.addEventListener('touchstart', startSlide);
        window.addEventListener('touchend', stopSlide);
        window.addEventListener('touchmove', (e) => {
            if (!isSliding) return;
            if (e.touches && e.touches[0]) {
                updateSlider(e.touches[0].clientX);
            }
        });

        // Clicking on the container directly jumps to that split point
        sliderContainer.addEventListener('click', (e) => {
            // Only jump if they didn't click the handle button directly
            if (e.target.closest('.slider-handle')) return;
            updateSlider(e.clientX);
        });
    }

    // ---------------------------------------------------------
    // 6. SOLUTIONS TABS SYSTEM
    // ---------------------------------------------------------
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const sliderBg = document.querySelector('.tabs-slider-bg');

    const updateTabHighlight = (activeBtn) => {
        if (!sliderBg || !activeBtn) return;
        // Make sure it doesn't run on small screens if tab headers wrap
        if (window.innerWidth <= 768) {
            sliderBg.style.display = 'none';
            return;
        } else {
            sliderBg.style.display = 'block';
        }
        
        sliderBg.style.width = `${activeBtn.offsetWidth}px`;
        sliderBg.style.left = `${activeBtn.offsetLeft}px`;
    };

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state from all buttons & panel
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            // Set active state on current
            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }

            // Move highlight pill
            updateTabHighlight(btn);
        });
    });

    // Initialize/sync first tab placement
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        // Run slightly deferred to ensure client dimensions are loaded
        setTimeout(() => updateTabHighlight(activeTab), 100);
    }

    // Keep highlight synced on resize
    window.addEventListener('resize', () => {
        const active = document.querySelector('.tab-btn.active');
        if (active) updateTabHighlight(active);
    });

    // ---------------------------------------------------------
    // 7. FAQ ACCORDION ACTIONS
    // ---------------------------------------------------------
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            const isActive = item.classList.contains('active');

            // Close all items first (uncomment for single accordion mode)
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-content').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                // Calculate scrollHeight dynamically for a smooth CSS transition
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                item.classList.remove('active');
                content.style.maxHeight = null;
            }
        });
    });

    // ---------------------------------------------------------
    // 8. DIAGNOSTIC EXPRESS QUIZ MODAL
    // ---------------------------------------------------------
    const modalTriggerBtns = document.querySelectorAll('.btn-modal-trigger');
    const modal = document.getElementById('quiz-modal');
    const modalCloseBtns = document.querySelectorAll('.modal-close-btn, .modal-close-btn-action, .modal-overlay');
    const quizSteps = document.querySelectorAll('.quiz-step');
    const quizProgressBar = document.getElementById('quiz-progress');
    const prevBtn = document.getElementById('quiz-prev-btn');
    const nextBtn = document.getElementById('quiz-next-btn');
    const quizNavigation = document.getElementById('quiz-navigation');

    let currentStepIndex = 1;
    let quizAnswers = {};
    let totalScore = 0;

    // Open Modal
    modalTriggerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('open');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
            resetQuiz();
        });
    });

    // Close Modal
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // If clicked on overlay, verify it was the overlay itself
            if (e.target === modal || e.target.closest('.modal-close-btn') || e.target.classList.contains('modal-close-btn-action')) {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });

    // Reset Quiz state
    const resetQuiz = () => {
        currentStepIndex = 1;
        quizAnswers = {};
        totalScore = 0;
        
        quizSteps.forEach(step => step.classList.remove('active'));
        document.querySelector('.quiz-step[data-step="1"]').classList.add('active');
        
        // Remove select states from all options
        const optionBtns = document.querySelectorAll('.option-btn');
        optionBtns.forEach(opt => opt.classList.remove('selected'));
        
        // Reset progress bar
        quizProgressBar.style.width = '33.33%';
        
        // Reset buttons
        prevBtn.disabled = true;
        nextBtn.textContent = 'Siguiente';
        quizNavigation.style.display = 'flex';
        
        // Reset success state
        document.getElementById('modal-success').classList.remove('show');
        
        // Reset Form
        document.getElementById('modal-lead-form').reset();
    };

    // Selecting quiz options
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Find parent step container and remove selects from its children only
            const parentStep = btn.closest('.quiz-step');
            parentStep.querySelectorAll('.option-btn').forEach(opt => opt.classList.remove('selected'));
            
            // Highlight current
            btn.classList.add('selected');
            
            const stepNum = parentStep.getAttribute('data-step');
            const score = parseInt(btn.getAttribute('data-score'), 10);
            const value = btn.getAttribute('data-value');
            
            quizAnswers[stepNum] = { score, value };
        });
    });

    // Navigation Step controls
    const navigateQuiz = (direction) => {
        if (direction === 'next') {
            // Check if user has answered current step question before proceeding
            const currentStepEl = document.querySelector(`.quiz-step[data-step="${currentStepIndex}"]`);
            const selectedOpt = currentStepEl.querySelector('.option-btn.selected');
            
            if (!selectedOpt) {
                alert('Por favor selecciona una opción antes de continuar.');
                return;
            }

            currentStepIndex++;
        } else if (direction === 'prev') {
            currentStepIndex--;
        }

        // Handle normal steps rendering
        quizSteps.forEach(step => step.classList.remove('active'));
        const nextStepEl = document.querySelector(`.quiz-step[data-step="${currentStepIndex}"]`);
        if (nextStepEl) {
            nextStepEl.classList.add('active');
        }

        // Manage Progress and Buttons
        if (currentStepIndex === 1) {
            prevBtn.disabled = true;
            nextBtn.textContent = 'Siguiente';
            quizProgressBar.style.width = '33.33%';
        } else if (currentStepIndex === 2) {
            prevBtn.disabled = false;
            nextBtn.textContent = 'Siguiente';
            quizProgressBar.style.width = '66.66%';
        } else if (currentStepIndex === 3) {
            prevBtn.disabled = false;
            nextBtn.textContent = 'Ver mi Resultado';
            quizProgressBar.style.width = '100%';
        } else if (currentStepIndex === 4) {
            // Render results phase
            quizNavigation.style.display = 'none'; // hide navigation buttons
            calculateResults();
        }
    };

    nextBtn.addEventListener('click', () => navigateQuiz('next'));
    prevBtn.addEventListener('click', () => navigateQuiz('prev'));

    // Calculating quiz outputs
    const calculateResults = () => {
        // Calculate cumulative risk score (min 0, max 65)
        totalScore = 0;
        let answersText = [];
        
        for (let step in quizAnswers) {
            totalScore += quizAnswers[step].score;
            answersText.push(`Paso ${step}: ${quizAnswers[step].value}`);
        }

        const scorePercent = Math.round((totalScore / 65) * 100);
        
        // Pass summary data to hidden inputs in the lead forms
        document.getElementById('quiz-answers').value = answersText.join(' | ');
        document.getElementById('quiz-risk-score').value = scorePercent + '%';

        // Render visual gauge meter
        const gaugeArc = document.getElementById('gauge-arc');
        const scoreVal = document.getElementById('risk-score-value');
        const label = document.getElementById('risk-level-label');
        const desc = document.getElementById('risk-result-msg');

        if (gaugeArc && scoreVal) {
            // Arc length is 188.5
            const offset = 188.5 - (188.5 * scorePercent) / 100;
            // Delay slightly for transition animation
            setTimeout(() => {
                gaugeArc.style.strokeDashoffset = offset;
            }, 100);

            // Counter animation for gauge value text
            let currentDisplayVal = 0;
            const interval = setInterval(() => {
                if (currentDisplayVal >= scorePercent) {
                    scoreVal.textContent = scorePercent + '%';
                    clearInterval(interval);
                } else {
                    currentDisplayVal++;
                    scoreVal.textContent = currentDisplayVal + '%';
                }
            }, 15);
        }

        // Adapt texts based on levels
        if (scorePercent >= 65) {
            label.textContent = 'Riesgo Crítico';
            label.className = 'gauge-label text-risk';
            desc.innerHTML = 'Tu oficina está **críticamente expuesta**. No cuentas con firewalls, careces de respaldos seguros e inmutables, y usas antivirus tradicionales. Un ataque de ransomware paralizaría tu negocio de inmediato.';
        } else if (scorePercent >= 35) {
            label.textContent = 'Riesgo Alto';
            label.className = 'gauge-label text-risk';
            desc.innerHTML = 'Tu empresa presenta **brechas de seguridad importantes**. Aunque tienes algún mecanismo de defensa, la falta de seguridad perimetral dedicada o de respaldos en la nube aislados te hace vulnerable a hackeos masivos.';
        } else {
            label.textContent = 'Riesgo Moderado';
            label.className = 'gauge-label text-secure';
            desc.innerHTML = 'Cuentas con algunas buenas prácticas, pero aún hay **ventanas de oportunidad**. Una configuración perimetral robusta o el monitoreo de endpoints cerraría los accesos a los bots automáticos.';
        }
    };

    // ---------------------------------------------------------
    // 9. LEAD FORMS SUBMISSION LOGIC (MAIN & MODAL)
    // ---------------------------------------------------------
    const handleFormSubmit = (formId, successId, modalSuccessState = false) => {
        const form = document.getElementById(formId);
        const successAlert = document.getElementById(successId);

        if (form && successAlert) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form values for visual feedback
                const formData = new FormData(form);
                const name = formData.get('name');
                const email = formData.get('email');
                const phone = formData.get('phone');

                // Simulate high-tech secure API call
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Encriptando datos...</span> <i data-lucide="loader-2" class="animate-spin"></i>';
                if (typeof lucide !== 'undefined') lucide.createIcons();

                setTimeout(() => {
                    // Hide Form
                    form.style.opacity = '0';
                    setTimeout(() => {
                        form.style.display = 'none';
                        
                        // Show Success Alert
                        if (modalSuccessState) {
                            successAlert.classList.add('show');
                        } else {
                            successAlert.style.display = 'flex';
                            setTimeout(() => successAlert.classList.add('show'), 50);
                        }
                    }, 250);

                    console.log(`Lead Capturado con éxito: Name: ${name}, Email: ${email}, Phone: ${phone}`);
                    if (formId === 'modal-lead-form') {
                        const quizSummary = formData.get('quiz_summary');
                        const quizScore = formData.get('quiz_score');
                        console.log(`Datos Diagnóstico: Score: ${quizScore}, Respuestas: ${quizSummary}`);
                    }
                }, 1500);
            });
        }
    };

    // Initialize submit events
    handleFormSubmit('lead-form', 'form-success', false);
    handleFormSubmit('modal-lead-form', 'modal-success', true);
});
