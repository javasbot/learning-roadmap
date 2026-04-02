// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载动画控制
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.style.display = 'none';
        }, 2000);
    }

    // 响应式导航菜单
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // 导航链接点击事件 - 关闭菜单并平滑滚动
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // 只处理内部链接
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // 关闭移动端菜单
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = navToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
                
                // 平滑滚动到目标位置
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80; // 考虑固定头部的高度
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 滚动时改变头部样式
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(10, 10, 10, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
    });

    // 文章卡片悬停效果增强
    const articleCards = document.querySelectorAll('.article-card');

    articleCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });

        // 文章卡片点击事件（如果需要）
        card.addEventListener('click', () => {
            const link = card.querySelector('.article-link');
            if (link) {
                window.location.href = link.getAttribute('href');
            }
        });
    });

    // 加载更多按钮动画
    const loadMoreBtn = document.querySelector('.load-more .btn');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 模拟加载更多
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
            loadMoreBtn.disabled = true;
            
            setTimeout(() => {
                loadMoreBtn.innerHTML = '查看更多文章';
                loadMoreBtn.disabled = false;
                
                // 这里可以添加实际的加载更多逻辑
                alert('加载更多文章功能演示');
            }, 1500);
        });
    }

    // 联系表单提交处理
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // 简单验证
            if (!name || !email || !message) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 模拟发送消息
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = '发送成功！';
                
                // 重置表单
                contactForm.reset();
                
                // 恢复按钮状态
                setTimeout(() => {
                    submitBtn.innerHTML = '发送消息';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // 订阅表单提交处理
    const subscribeForm = document.querySelector('.subscribe-form form');

    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(subscribeForm);
            const email = formData.get('email');
            
            // 简单验证
            if (!email) {
                alert('请输入您的邮箱地址');
                return;
            }
            
            // 模拟发送订阅请求
            const submitBtn = subscribeForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 订阅中...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = '订阅成功！';
                submitBtn.style.backgroundColor = '#27ae60';
                
                // 重置表单
                subscribeForm.reset();
                
                // 恢复按钮状态
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // 社交链接悬停效果
    const socialLinks = document.querySelectorAll('.social-link, .footer .social-links a');

    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-4px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 数字统计动画
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/\D/g, ''));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                const unit = stat.textContent.replace(/\d/g, '');
                stat.textContent = Math.floor(current) + unit;
            }, 16);
        });
    }

    // 当数字统计元素进入视口时触发动画
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.featured-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // 滚动触发的元素动画
    const animatedElements = document.querySelectorAll('.article-card, .about-content, .contact-content, .subscribe-content');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(el);
    });

    // 平滑滚动到页面顶部（如果需要）
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 鼠标移动效果（可选，增加页面动感）
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.shape');
        if (shapes.length > 0) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                const translateX = (x - 0.5) * 50 * speed;
                const translateY = (y - 0.5) * 50 * speed;
                
                shape.style.transform = `translate(${translateX}px, ${translateY}px)`;
            });
        }
    });
});

// 图片懒加载
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                image.src = image.dataset.src || image.src;
                imageObserver.unobserve(image);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}