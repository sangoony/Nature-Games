
        // متغیرهای بازی
        let budget = 3000;
        let score = 0;
        let season = 0;
        let year = 1;
        let seasons = ["بهار", "تابستان", "پاییز", "زمستان"];
        let vegetation = 45;
        let erosion = 35;
        let tiles = [];
        let initialTilesData = [];
        let researchLevel = 0;
        let altIncome = 0;
        let hasHerbs = false;
        let hasTourism = false;
        let hasBeekeeping = false;
        let hasLivestock = false;
        let hasOtherInvest = false;
        let timerValue = 30;
        let timerInterval;
        let tileCount = 9;
        let gridRows = 3;
        let gridCols = 3;
        let selectedTile = null;
        let lastActions = [];
        let difficulty = "easy";
        let farmerSatisfaction = 50;
        let lastGrazingSystemYear = 0;
        let gameHistory = {
            vegetation: [],
            erosion: [],
            budget: [],
            score: [],
            seasons: [],
            farmerSatisfaction: []
        };
        let highScores = JSON.parse(localStorage.getItem('rangelandHighScores')) || {};
        let educationalLinks = [
            { title: "مثال واقعی از مدیریت مراتع در ایران", url: "https://example.com/rangeland1" },
            { title: "راهکارهای احیای مراتع تخریب شده", url: "https://example.com/rangeland2" },
            { title: "تأثیر تغییرات اقلیمی بر مراتع", url: "https://example.com/rangeland3" }
        ];

        // نکات روز برای آموزش بهتر
        const dailyTips = [
            "💡 استراحت دادن به قطعات به مدت یک فصل می‌تواند سلامت آن‌ها را تا 15% افزایش دهد.",
            "💡 نسبت ایده‌آل دام به ظرفیت مرتع باید کمتر از 1 باشد تا تخریب رخ ندهد.",
            "💡 کاشت گیاه در فصل بهار بهترین نتیجه را دارد و می‌تواند ظرفیت مرتع را افزایش دهد.",
            "💡 درآمدهای جایگزین می‌توانند فشار چرا را کاهش داده و پایداری اقتصادی ایجاد کنند.",
            "💡 خاک‌های سبک نیاز به مدیریت دقیق‌تر دارند زیرا مستعد فرسایش بیشتری هستند.",
            "💡 مراتع کوهستانی به دلیل شیب زیاد، نیاز به اقدامات حفاظتی بیشتری دارند.",
            "💡 کوددهی منظم می‌تواند رشد گیاهان را تسریع کند اما باید در زمان مناسب انجام شود.",
            "💡 آبیاری در فصل تابستان ضروری است اما مصرف بهینه آب را فراموش نکنید.",
            "💡 افزایش دام بدون برنامه‌ریزی می‌تواند به سرعت منجر به تخریب مرتع شود.",
            "💡 رویدادهای طبیعی مانند خشکسالی غیرقابل پیش‌بینی هستند، پس همیشه بودجه ذخیره داشته باشید.",
            "💡 سلامت کلی مرتع بالای 70% نشان‌دهنده مدیریت مؤثر است.",
            "💡 اکوتوریسم نه تنها درآمد ایجاد می‌کند بلکه آگاهی عمومی را نیز افزایش می‌دهد.",
            "💡 تحقیق و توسعه می‌تواند به شناسایی گونه‌های مقاوم‌تر کمک کند.",
            "💡 همکاری با دامداران محلی کلید موفقیت در مدیریت پایدار مراتع است.",
            "💡 فصل پاییز زمان مناسبی برای ارزیابی و برنامه‌ریزی برای سال آینده است."
        ];
        
        // متغیر برای نمایش نکته روز
        let lastTipSeason = -1;
        
        // تابع نمایش نکته روز
        function showDailyTip() {
            const totalSeasons = (year - 1) * 4 + season;
            
            // هر 8 فصل (2 سال) یک نکته نمایش بده
            if (totalSeasons > 0 && totalSeasons % 8 === 0 && totalSeasons !== lastTipSeason) {
                lastTipSeason = totalSeasons;
                
                const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
                
                // نمایش popup نکته
                const overlay = document.getElementById('overlay');
                const popup = document.createElement('div');
                popup.className = 'event-popup';
                popup.style.display = 'block';
                popup.style.border = '3px solid #ffc107';
                popup.style.background = 'linear-gradient(135deg, #fff9e6 0%, #ffffff 100%)';
                popup.innerHTML = `
                    <h2 style="color: #f57c00; margin-top: 0;">💡 نکته روز</h2>
                    <p style="font-size: 16px; line-height: 1.8;">${randomTip}</p>
                    <button onclick="this.parentElement.remove(); document.getElementById('overlay').style.display='none';">متشکرم!</button>
                `;
                
                document.body.appendChild(popup);
                overlay.style.display = 'block';
                
                addEvent("💡 نکته روز جدیدی برای شما نمایش داده شد!");
            }
        }

        
        
        // ==========================================
        // سیستم ثبت دقیق تصمیمات دانشجو
        // ==========================================
        let studentDecisions = [];
        let studentName = "";
        let studentId = "";
        let studentGrade = 0; // نمره از 0 تا 100
        let gradeHistory = []; // تاریخچه نمره در طول بازی
        let decisionTimes = []; // زمان باقیمانده در هر تصمیم
        let uniqueActions = new Set(); // انواع اقدامات انجام شده
        let initialAverageHealth = 0; // سلامت اولیه برای محاسبه بهبود
        
        // تابع ثبت تصمیم
        function recordDecision(actionType, actionName, tileNumber, cost, result) {
            const decision = {
                timestamp: new Date().toISOString(),
                season: seasons[season],
                year: year,
                seasonNumber: (year - 1) * 4 + season + 1, // شماره فصل از ابتدای بازی
                actionType: actionType, // نوع اقدام (management, income, etc.)
                actionName: actionName, // نام اقدام به فارسی
                tileNumber: tileNumber || 'کل مرتع', // شماره قطعه یا کل مرتع
                cost: cost,
                budgetBefore: budget + cost, // بودجه قبل از اقدام
                budgetAfter: budget, // بودجه بعد از اقدام
                result: result, // نتیجه (موفق، ناموفق، هدر رفت)
                tileDetails: tileNumber ? {
                    vegetation: tiles[tileNumber - 1].dataset.vegetation,
                    erosion: tiles[tileNumber - 1].dataset.erosion,
                    cattle: tiles[tileNumber - 1].dataset.cattle,
                    capacity: tiles[tileNumber - 1].dataset.capacity,
                    soilType: tiles[tileNumber - 1].dataset.soilType,
                    topography: tiles[tileNumber - 1].dataset.topography
                } : null
            };
            
            studentDecisions.push(decision);
            
            // ذخیره در localStorage
            localStorage.setItem('studentDecisions_' + Date.now(), JSON.stringify(studentDecisions));
        }
        
        // تابع تولید گزارش کامل تصمیمات
        function generateDecisionReport() {
            if (studentDecisions.length === 0) {
                alert('هیچ تصمیمی ثبت نشده است!');
                return;
            }
            
            // ساخت محتوای گزارش
            let reportHTML = `
                <div style="direction: rtl; text-align: right; padding: 20px; font-family: Tahoma, Arial;">
                    <h2 style="text-align: center; color: #5a723f;">گزارش دقیق تصمیمات دانشجو</h2>
                    <div style="text-align: center; margin: 20px 0; padding: 15px; background-color: #f0f8ff; border-radius: 8px;">
                        <p style="margin: 5px 0;"><strong>نام دانشجو:</strong> ${studentName}</p>
                        <p style="margin: 5px 0;"><strong>شماره دانشجویی:</strong> ${studentId}</p>
                        <p style="margin: 5px 0;"><strong>تاریخ:</strong> ${new Date().toLocaleDateString('fa-IR')}</p>
                        <p style="margin: 5px 0;"><strong>سطح دشواری:</strong> ${window.gameSettings.difficultyText}</p>
                        <p style="margin: 5px 0;"><strong>تعداد قطعات:</strong> ${window.gameSettings.tileCount}</p>
                        <p style="margin: 5px 0;"><strong>تعداد کل تصمیمات:</strong> ${studentDecisions.length}</p>
                        <p style="margin: 5px 0; font-size: 20px; color: #5a723f;"><strong>نمره نهایی:</strong> ${studentGrade}/100</p>
                    </div>
                    
                    ${gradeHistory.length > 0 && gradeHistory[gradeHistory.length - 1].breakdown ? `
                    <div style="margin: 20px 0; padding: 15px; background-color: #fff9e6; border-radius: 8px; border: 1px solid #ffc107;">
                        <h3 style="color: #f57c00; margin-top: 0;">📊 جزئیات محاسبه نمره</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                            <div>✅ نرخ موفقیت (30%): <strong>${gradeHistory[gradeHistory.length - 1].breakdown.success}</strong></div>
                            <div>🌱 سلامت مرتع (20%): <strong>${gradeHistory[gradeHistory.length - 1].breakdown.health}</strong></div>
                            <div>📈 بهبود نسبت به اول (15%): <strong>${gradeHistory[gradeHistory.length - 1].breakdown.improvement}</strong></div>
                            <div>💰 مدیریت بودجه (10%): <strong>${gradeHistory[gradeHistory.length - 1].breakdown.budget}</strong></div>
                            <div>🌍 کاهش فرسایش (10%): <strong>${gradeHistory[gradeHistory.length - 1].breakdown.erosion}</strong></div>
                            <div>💼 درآمد جایگزین (5%): <strong>${gradeHistory[gradeHistory.length - 1].breakdown.altIncome}</strong></div>
                            <div>😊 رضایت دامداران (5%): <strong>${gradeHistory[gradeHistory.length - 1].breakdown.satisfaction}</strong></div>
                            <div>🎯 تنوع اقدامات (5%): <strong>${gradeHistory[gradeHistory.length - 1].breakdown.diversity}</strong></div>
                            <div style="color: #f44336;">❌ جریمه تصمیمات غلط: <strong>-${gradeHistory[gradeHistory.length - 1].breakdown.penalty}</strong></div>
                            <div style="color: #4caf50;">🎁 بونوس تحقیق: <strong>+${gradeHistory[gradeHistory.length - 1].breakdown.researchBonus}</strong></div>
                            <div style="color: #2196F3;">⭐ ضریب سطح ${window.gameSettings.difficultyText}: <strong>×${gradeHistory[gradeHistory.length - 1].breakdown.multiplier}</strong></div>
                            <div style="font-weight: bold;">📊 نمره قبل از ضریب: <strong>${gradeHistory[gradeHistory.length - 1].breakdown.beforeMultiplier}</strong></div>
                        </div>
                    </div>
                    ` : ''}
                    <hr>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <thead>
                            <tr style="background-color: #5a723f; color: white;">
                                <th style="border: 1px solid #ddd; padding: 8px;">ردیف</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">فصل/سال</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">اقدام</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">قطعه</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">هزینه</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">نتیجه</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            studentDecisions.forEach((decision, index) => {
                const resultColor = decision.result === 'موفق' ? '#4caf50' : 
                                   decision.result === 'هدر رفت' ? '#f44336' : '#ff9800';
                
                reportHTML += `
                    <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : 'white'};">
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${decision.season} سال ${decision.year}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${decision.actionName}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${decision.tileNumber}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${decision.cost}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center; color: ${resultColor}; font-weight: bold;">
                            ${decision.result}
                        </td>
                    </tr>
                `;
            });
            
            reportHTML += `
                        </tbody>
                    </table>
                    
                    <div style="margin-top: 30px; padding: 15px; background-color: #f0f8ff; border-radius: 8px;">
                        <h3>آمار کلی:</h3>
                        <p>✅ تصمیمات موفق: <strong>${studentDecisions.filter(d => d.result === 'موفق').length}</strong></p>
                        <p>❌ تصمیمات ناموفق/هدر رفت: <strong>${studentDecisions.filter(d => d.result !== 'موفق').length}</strong></p>
                        <p>💰 کل هزینه‌ها: <strong>${studentDecisions.reduce((sum, d) => sum + d.cost, 0)}</strong></p>
                        <p>📊 میانگین هزینه هر تصمیم: <strong>${Math.round(studentDecisions.reduce((sum, d) => sum + d.cost, 0) / studentDecisions.length)}</strong></p>
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <button onclick="exportDecisionsToCSV()" style="padding: 10px 20px; margin: 5px; background-color: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            دانلود Excel (CSV)
                        </button>
                        <button onclick="exportDecisionsToPDF()" style="padding: 10px 20px; margin: 5px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            دانلود PDF
                        </button>
                        <button onclick="closeDecisionReport()" style="padding: 10px 20px; margin: 5px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            بستن
                        </button>
                    </div>
                </div>
            `;
            
            // نمایش گزارش در پاپ‌آپ
            const popup = document.createElement('div');
            popup.id = 'decision-report-popup';
            popup.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                border: 2px solid #5a723f;
                border-radius: 10px;
                padding: 20px;
                width: 90%;
                max-width: 1000px;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 10000;
                box-shadow: 0 0 20px rgba(0,0,0,0.3);
            `;
            popup.innerHTML = reportHTML;
            
            const overlay = document.createElement('div');
            overlay.id = 'decision-report-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0,0,0,0.7);
                z-index: 9999;
            `;
            
            document.body.appendChild(overlay);
            document.body.appendChild(popup);
        }
        
        // بستن گزارش
        function closeDecisionReport() {
            const popup = document.getElementById('decision-report-popup');
            const overlay = document.getElementById('decision-report-overlay');
            if (popup) popup.remove();
            if (overlay) overlay.remove();
        }
        
        
        // ==========================================
        // سیستم نمره‌دهی پیشرفته (0-100)
        // ==========================================
        function calculateStudentGrade() {
            if (studentDecisions.length === 0) {
                studentGrade = 0;
                return;
            }
            
            let grade = 0;
            let breakdown = {}; // برای نمایش جزئیات
            
            // 1. نرخ موفقیت تصمیمات (30%)
            const successCount = studentDecisions.filter(d => d.result === 'موفق').length;
            const successRate = successCount / studentDecisions.length;
            const successScore = successRate * 30;
            grade += successScore;
            breakdown.success = successScore.toFixed(1);
            
            // 2. سلامت نهایی مرتع (20%)
            const avgHealth = tiles.reduce((sum, tile) => sum + parseInt(tile.dataset.vegetation), 0) / tiles.length;
            const healthScore = (avgHealth / 100) * 20;
            grade += healthScore;
            breakdown.health = healthScore.toFixed(1);
            
            // 3. بهبود نسبت به وضعیت اولیه (15%)
            let improvementScore = 0;
            if (initialAverageHealth > 0) {
                const improvement = (avgHealth - initialAverageHealth) / initialAverageHealth;
                improvementScore = Math.max(0, improvement * 15);
            }
            grade += improvementScore;
            breakdown.improvement = improvementScore.toFixed(1);
            
            // 4. مدیریت بودجه (10%)
            let budgetScore = 0;
            if (budget > 0) {
                budgetScore = Math.min((budget / 3000) * 10, 10);
            }
            grade += budgetScore;
            breakdown.budget = budgetScore.toFixed(1);
            
            // 5. کاهش فرسایش (10%)
            const avgErosion = tiles.reduce((sum, tile) => sum + parseInt(tile.dataset.erosion), 0) / tiles.length;
            const erosionScore = Math.max((100 - avgErosion) / 100 * 10, 0);
            grade += erosionScore;
            breakdown.erosion = erosionScore.toFixed(1);
            
            // 6. استفاده از درآمدهای جایگزین (5%)
            const altIncomeTypes = [hasHerbs, hasTourism, hasBeekeeping, hasLivestock, hasOtherInvest].filter(x => x).length;
            const altIncomeScore = (altIncomeTypes / 5) * 5;
            grade += altIncomeScore;
            breakdown.altIncome = altIncomeScore.toFixed(1);
            
            // 7. رضایت دامداران (5%)
            const satisfactionScore = (farmerSatisfaction / 100) * 5;
            grade += satisfactionScore;
            breakdown.satisfaction = satisfactionScore.toFixed(1);
            
            // 8. تنوع اقدامات (5%)
            const diversityScore = (uniqueActions.size / 8) * 5;
            grade += diversityScore;
            breakdown.diversity = diversityScore.toFixed(1);
            
            // جریمه: تصمیمات هدر رفت (-2 هر کدام)
            const wastedCount = studentDecisions.filter(d => d.result.includes('هدر رفت')).length;
            const penalty = wastedCount * 2;
            grade -= penalty;
            breakdown.penalty = penalty.toFixed(1);
            
            // بونوس: استفاده از تحقیق (+5)
            let researchBonus = 0;
            if (researchLevel > 0) {
                researchBonus = 5;
                grade += researchBonus;
            }
            breakdown.researchBonus = researchBonus.toFixed(1);
            
            // ضریب سطح دشواری
            const difficultyMultipliers = {
                'easy': 1.0,
                'medium': 1.1,
                'hard': 1.2
            };
            const multiplier = difficultyMultipliers[difficulty] || 1.0;
            grade = grade * multiplier;
            breakdown.multiplier = multiplier;
            breakdown.beforeMultiplier = (grade / multiplier).toFixed(1);
            
            // محدود کردن نمره بین 0 تا 100
            studentGrade = Math.round(Math.max(0, Math.min(grade, 100)));
            
            // ذخیره در تاریخچه
            gradeHistory.push({
                turn: (year - 1) * 4 + season,
                grade: studentGrade,
                breakdown: breakdown
            });
            
            return studentGrade;
        }
        
        // محاسبه نمره در هر نوبت
        const originalNextSeason = nextSeason;

        
        // ==========================================
        // سیستم مقایسه دانشجویان
        // ==========================================
        
        // ذخیره نمره دانشجو در localStorage
        function saveStudentGradeToHistory() {
            let allGrades = JSON.parse(localStorage.getItem('allStudentGrades')) || [];
            
            const studentData = {
                name: studentName,
                id: studentId,
                grade: studentGrade,
                date: new Date().toISOString(),
                difficulty: window.gameSettings.difficultyText,
                tileCount: window.gameSettings.tileCount,
                decisions: studentDecisions.length,
                successRate: Math.round((studentDecisions.filter(d => d.result === 'موفق').length / studentDecisions.length) * 100)
            };
            
            allGrades.push(studentData);
            localStorage.setItem('allStudentGrades', JSON.stringify(allGrades));
        }
        
        // نمایش مقایسه دانشجویان
        function showStudentComparison() {
            const allGrades = JSON.parse(localStorage.getItem('allStudentGrades')) || [];
            
            if (allGrades.length === 0) {
                alert('هنوز هیچ بازی‌ای ثبت نشده است!');
                return;
            }
            
            // مرتب‌سازی بر اساس نمره
            allGrades.sort((a, b) => b.grade - a.grade);
            
            let comparisonHTML = `
                <div style="direction: rtl; text-align: right; padding: 20px; font-family: Tahoma, Arial;">
                    <h2 style="text-align: center; color: #5a723f;">مقایسه نمرات دانشجویان</h2>
                    <p style="text-align: center;">تعداد کل بازی‌ها: <strong>${allGrades.length}</strong></p>
                    <hr>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <thead>
                            <tr style="background-color: #5a723f; color: white;">
                                <th style="border: 1px solid #ddd; padding: 8px;">رتبه</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">نام</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">شماره دانشجویی</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">نمره</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">نرخ موفقیت</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">سطح</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">تاریخ</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            allGrades.forEach((student, index) => {
                const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                const gradeColor = student.grade >= 80 ? '#4caf50' : student.grade >= 60 ? '#ff9800' : '#f44336';
                
                comparisonHTML += `
                    <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : 'white'};">
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${rankEmoji} ${index + 1}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${student.name}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${student.id}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; color: ${gradeColor};">
                            ${student.grade}/100
                        </td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${student.successRate}%</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 11px;">${student.difficulty}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 11px;">
                            ${new Date(student.date).toLocaleDateString('fa-IR')}
                        </td>
                    </tr>
                `;
            });
            
            comparisonHTML += `
                        </tbody>
                    </table>
                    
                    <div style="margin-top: 30px; padding: 15px; background-color: #f0f8ff; border-radius: 8px;">
                        <h3>آمار کلی:</h3>
                        <p>📊 میانگین نمرات: <strong>${Math.round(allGrades.reduce((sum, s) => sum + s.grade, 0) / allGrades.length)}/100</strong></p>
                        <p>🏆 بالاترین نمره: <strong>${allGrades[0].grade}/100</strong> (${allGrades[0].name})</p>
                        <p>📉 پایین‌ترین نمره: <strong>${allGrades[allGrades.length - 1].grade}/100</strong></p>
                        <p>✅ میانگین نرخ موفقیت: <strong>${Math.round(allGrades.reduce((sum, s) => sum + s.successRate, 0) / allGrades.length)}%</strong></p>
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <button onclick="exportComparisonToCSV()" style="padding: 10px 20px; margin: 5px; background-color: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            دانلود Excel (CSV)
                        </button>
                        <button onclick="clearAllGrades()" style="padding: 10px 20px; margin: 5px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            پاک کردن همه نمرات
                        </button>
                        <button onclick="closeComparison()" style="padding: 10px 20px; margin: 5px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            بستن
                        </button>
                    </div>
                </div>
            `;
            
            // نمایش در پاپ‌آپ
            const popup = document.createElement('div');
            popup.id = 'comparison-popup';
            popup.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                border: 2px solid #5a723f;
                border-radius: 10px;
                padding: 20px;
                width: 90%;
                max-width: 1200px;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 10000;
                box-shadow: 0 0 20px rgba(0,0,0,0.3);
            `;
            popup.innerHTML = comparisonHTML;
            
            const overlay = document.createElement('div');
            overlay.id = 'comparison-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0,0,0,0.7);
                z-index: 9999;
            `;
            
            document.body.appendChild(overlay);
            document.body.appendChild(popup);
        }
        
        // بستن مقایسه
        function closeComparison() {
            const popup = document.getElementById('comparison-popup');
            const overlay = document.getElementById('comparison-overlay');
            if (popup) popup.remove();
            if (overlay) overlay.remove();
        }
        
        // خروجی CSV مقایسه
        function exportComparisonToCSV() {
            const allGrades = JSON.parse(localStorage.getItem('allStudentGrades')) || [];
            allGrades.sort((a, b) => b.grade - a.grade);
            
            let csv = 'رتبه,نام دانشجو,شماره دانشجویی,نمره,نرخ موفقیت,سطح دشواری,تعداد قطعات,تعداد تصمیمات,تاریخ\n';
            
            allGrades.forEach((student, index) => {
                csv += `${index + 1},"${student.name}",${student.id},${student.grade},${student.successRate}%,"${student.difficulty}",${student.tileCount},${student.decisions},"${new Date(student.date).toLocaleDateString('fa-IR')}"\n`;
            });
            
            const BOM = "\uFEFF";
            const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `مقایسه_دانشجویان_${Date.now()}.csv`;
            link.click();
        }
        
        // پاک کردن همه نمرات
        function clearAllGrades() {
            if (confirm('آیا مطمئن هستید که می‌خواهید همه نمرات را پاک کنید؟')) {
                localStorage.removeItem('allStudentGrades');
                alert('همه نمرات پاک شدند!');
                closeComparison();
            }
        }

        // خروجی CSV
        function exportDecisionsToCSV() {
            // هدر فایل با اطلاعات دانشجو
            let csv = `نام دانشجو: ${studentName}\n`;
            csv += `شماره دانشجویی: ${studentId}\n`;
            csv += `تاریخ: ${new Date().toLocaleDateString('fa-IR')}\n`;
            csv += `سطح دشواری: ${window.gameSettings.difficultyText}\n`;
            csv += `تعداد قطعات: ${window.gameSettings.tileCount}\n`;
            csv += `نمره نهایی: ${studentGrade}/100\n`;
            if (gradeHistory.length > 0 && gradeHistory[gradeHistory.length - 1].breakdown) {
                const b = gradeHistory[gradeHistory.length - 1].breakdown;
                csv += `\nجزئیات نمره:\n`;
                csv += `نرخ موفقیت (30%): ${b.success}\n`;
                csv += `سلامت مرتع (20%): ${b.health}\n`;
                csv += `بهبود (15%): ${b.improvement}\n`;
                csv += `بودجه (10%): ${b.budget}\n`;
                csv += `فرسایش (10%): ${b.erosion}\n`;
                csv += `درآمد جایگزین (5%): ${b.altIncome}\n`;
                csv += `رضایت (5%): ${b.satisfaction}\n`;
                csv += `تنوع (5%): ${b.diversity}\n`;
                csv += `جریمه: -${b.penalty}\n`;
                csv += `بونوس تحقیق: +${b.researchBonus}\n`;
                csv += `ضریب سطح: ×${b.multiplier}\n`;
                csv += `نمره قبل از ضریب: ${b.beforeMultiplier}\n`;
            }
            csv += `\n`;
            csv += 'ردیف,فصل,سال,شماره فصل کلی,نوع اقدام,نام اقدام,شماره قطعه,هزینه,بودجه قبل,بودجه بعد,نتیجه,پوشش گیاهی,فرسایش,دام موجود,ظرفیت,نوع خاک,توپوگرافی\n';
            
            studentDecisions.forEach((d, i) => {
                csv += `${i+1},"${d.season}",${d.year},${d.seasonNumber},"${d.actionType}","${d.actionName}","${d.tileNumber}",${d.cost},${d.budgetBefore},${d.budgetAfter},"${d.result}"`;
                
                if (d.tileDetails) {
                    csv += `,"${d.tileDetails.vegetation}","${d.tileDetails.erosion}","${d.tileDetails.cattle}","${d.tileDetails.capacity}","${d.tileDetails.soilType}","${d.tileDetails.topography}"`;
                } else {
                    csv += ',,,,,,,';
                }
                csv += '\n';
            });
            
            // اضافه کردن BOM برای نمایش صحیح فارسی در Excel
            const BOM = "\uFEFF";
            const csvWithBOM = BOM + csv;
            const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `گزارش_${studentName}_${studentId}_${Date.now()}.csv`;
            link.click();
        }
        
        // خروجی PDF
        function exportDecisionsToPDF() {
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: 'a4'
                });
                
                // تابع تبدیل فارسی به رومن (برای نمایش در PDF)
                function persianToRoman(text) {
                    const map = {
                        'آ': 'a', 'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j',
                        'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z',
                        'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z',
                        'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l',
                        'م': 'm', 'ن': 'n', 'و': 'v', 'ه': 'h', 'ی': 'i', 'ئ': 'i',
                        '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', 
                        '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
                        ' ': ' ', '-': '-', '_': '_', '(': '(', ')': ')'
                    };
                    return text.split('').map(c => map[c] || c).join('');
                }
                
                // عنوان
                doc.setFontSize(18);
                doc.text('Rangeland Management - Student Decision Report', 148, 15, { align: 'center' });
                
                // اطلاعات دانشجو
                doc.setFontSize(12);
                doc.text('Student Information:', 20, 25);
                doc.setFontSize(10);
                doc.text(`Name: ${persianToRoman(studentName)}`, 25, 32);
                doc.text(`ID: ${studentId}`, 25, 39);
                doc.text(`Date: ${new Date().toLocaleDateString()}`, 25, 46);
                doc.text(`Difficulty: ${window.gameSettings.difficulty}`, 25, 53);
                doc.text(`Number of Tiles: ${window.gameSettings.tileCount}`, 25, 60);
                doc.text(`Total Decisions: ${studentDecisions.length}`, 25, 67);
                doc.text(`Final Grade: ${studentGrade}/100`, 25, 74);
                
                // جزئیات نمره
                if (gradeHistory.length > 0 && gradeHistory[gradeHistory.length - 1].breakdown) {
                    const b = gradeHistory[gradeHistory.length - 1].breakdown;
                    doc.setFontSize(8);
                    let yPos = 85;
                    doc.text(`Success Rate (30%): ${b.success}`, 25, yPos); yPos += 5;
                    doc.text(`Health (20%): ${b.health}`, 25, yPos); yPos += 5;
                    doc.text(`Improvement (15%): ${b.improvement}`, 25, yPos); yPos += 5;
                    doc.text(`Budget (10%): ${b.budget}`, 25, yPos); yPos += 5;
                    doc.text(`Erosion Control (10%): ${b.erosion}`, 25, yPos); yPos += 5;
                    doc.text(`Alt Income (5%): ${b.altIncome}`, 25, yPos); yPos += 5;
                    doc.text(`Satisfaction (5%): ${b.satisfaction}`, 25, yPos); yPos += 5;
                    doc.text(`Diversity (5%): ${b.diversity}`, 25, yPos); yPos += 5;
                    doc.text(`Penalty: -${b.penalty}`, 25, yPos); yPos += 5;
                    doc.text(`Research Bonus: +${b.researchBonus}`, 25, yPos); yPos += 5;
                    doc.text(`Difficulty Multiplier: x${b.multiplier}`, 25, yPos);
                }
                
                // رسم نمودار ساده نمره
                doc.setFillColor(90, 114, 63);
                doc.rect(150, 30, (studentGrade * 1.2), 10, 'F');
                doc.setFontSize(8);
                doc.text('Grade Progress:', 150, 28);
                doc.text(`${studentGrade}%`, 150 + (studentGrade * 1.2) + 2, 38);
                
                // ساخت جدول با تبدیل به انگلیسی
                const seasonMap = {'بهار': 'Spring', 'تابستان': 'Summer', 'پاییز': 'Fall', 'زمستان': 'Winter'};
                const resultMap = {'موفق': 'Success', 'هدر رفت - کوهستانی': 'Wasted - Mountain', 
                                  'هدر رفت - فصل نامناسب': 'Wasted - Wrong Season', 
                                  'هدر رفت - تابستان': 'Wasted - Summer'};
                
                const tableData = studentDecisions.map((d, i) => [
                    (i + 1).toString(),
                    (seasonMap[d.season] || d.season) + ' Y' + d.year,
                    persianToRoman(d.actionName),
                    d.tileNumber.toString(),
                    d.cost.toString(),
                    resultMap[d.result] || d.result
                ]);
                
                doc.autoTable({
                    head: [['#', 'Season/Year', 'Action', 'Tile', 'Cost', 'Result']],
                    body: tableData,
                    startY: 145,
                    styles: { font: 'Tahoma', fontSize: 9, halign: 'center' },
                    headStyles: { fillColor: [90, 114, 63] }
                });
                
                // آمار
                const successCount = studentDecisions.filter(d => d.result === 'موفق').length;
                const failCount = studentDecisions.length - successCount;
                const totalCost = studentDecisions.reduce((sum, d) => sum + d.cost, 0);
                
                const finalY = doc.lastAutoTable.finalY + 10;
                doc.setFontSize(12);
                doc.text(`تصمیمات موفق: ${successCount}`, 240, finalY);
                doc.text(`تصمیمات ناموفق: ${failCount}`, 240, finalY + 7);
                doc.text(`کل هزینه‌ها: ${totalCost}`, 240, finalY + 14);
                
                doc.save(`Report_${studentName.replace(/\s+/g, '_')}_${studentId}_${Date.now()}.pdf`);
            } catch (error) {
                alert('خطا در تولید PDF. لطفاً از دکمه CSV استفاده کنید.');
                console.error(error);
            }
        }

        
        // ==========================================
        // سیستم کد یکبار مصرف (OTP)
        // ==========================================
        const OTP_CODES = {
            "easy": [
                        "79790307",
                        "23731796",
                        "54051315",
                        "61596169",
                        "01064183",
                        "89001947",
                        "76217225",
                        "49781095",
                        "95905869",
                        "62837589",
                        "15949146",
                        "77122170",
                        "69959816",
                        "34527046",
                        "77429318",
                        "85954007",
                        "81206110",
                        "15137115",
                        "82707084",
                        "67313225",
                        "67913891",
                        "77344578",
                        "54854257",
                        "09201597",
                        "67664921",
                        "18174371",
                        "45611287",
                        "86894497",
                        "77390988",
                        "97869518",
                        "30355862",
                        "42610455",
                        "33107598",
                        "95338916",
                        "44008742",
                        "63814993",
                        "33044895",
                        "62442348",
                        "20898358",
                        "50155326",
                        "37454684",
                        "41223620",
                        "64223930",
                        "83388727",
                        "58125136",
                        "59938236",
                        "39211330",
                        "47949706",
                        "21123408",
                        "68800296"
            ],
            "medium": [
                        "28014393",
                        "67730620",
                        "86403863",
                        "76058325",
                        "59035738",
                        "56733612",
                        "00552949",
                        "22970172",
                        "76034704",
                        "16626751",
                        "83787133",
                        "23310328",
                        "66912378",
                        "88818683",
                        "87916659",
                        "78945278",
                        "18713986",
                        "16445771",
                        "63734046",
                        "12122920",
                        "84868324",
                        "86717253",
                        "59325885",
                        "29690886",
                        "23657839",
                        "90875114",
                        "15712769",
                        "73640594",
                        "05603119",
                        "00777638",
                        "69546096",
                        "70994797",
                        "03493058",
                        "77638604",
                        "07601448",
                        "71171228",
                        "05382807",
                        "81006019",
                        "68265528",
                        "09488720",
                        "82939056",
                        "54254026",
                        "36138096",
                        "69792050",
                        "54890213",
                        "91955732",
                        "91940203",
                        "28358683",
                        "41374540",
                        "48812550"
            ],
            "hard": [
                        "12914700",
                        "53891850",
                        "72179084",
                        "79724683",
                        "78680198",
                        "90978327",
                        "27005304",
                        "50737845",
                        "86518295",
                        "07649681",
                        "33845175",
                        "64908239",
                        "06613990",
                        "18471448",
                        "51735652",
                        "51719186",
                        "62187287",
                        "89305679",
                        "02353279",
                        "82218804",
                        "38192735",
                        "40121736",
                        "75344174",
                        "21681962",
                        "77292430",
                        "59363345",
                        "17405709",
                        "26645950",
                        "67825404",
                        "07914014",
                        "04191737",
                        "01131778",
                        "55695082",
                        "70940963",
                        "81019095",
                        "02689683",
                        "33226466",
                        "95225506",
                        "21882206",
                        "59091809",
                        "22702146",
                        "61707023",
                        "34129901",
                        "63258309",
                        "09896620",
                        "37621983",
                        "37206444",
                        "46913406",
                        "84418411",
                        "54266161"
            ]
};
        
        const USED_CODES_KEY = 'rangeland_used_otps';
        
        // بررسی استفاده شده بودن کد
        function isCodeUsed(code, difficulty) {
            const usedCodes = JSON.parse(localStorage.getItem(USED_CODES_KEY)) || {};
            return usedCodes[difficulty]?.includes(code) || false;
        }
        
        // علامت‌گذاری کد به عنوان استفاده شده
        function markCodeAsUsed(code, difficulty) {
            const usedCodes = JSON.parse(localStorage.getItem(USED_CODES_KEY)) || {};
            if (!usedCodes[difficulty]) {
                usedCodes[difficulty] = [];
            }
            usedCodes[difficulty].push(code);
            localStorage.setItem(USED_CODES_KEY, JSON.stringify(usedCodes));
        }
        
        // اعتبارسنجی کد دسترسی
        function validateOTP(code, difficulty) {
            // بررسی اینکه کد در لیست کدهای معتبر است
            const difficultyMap = {
                'easy': 'easy',
                'medium': 'medium', 
                'hard': 'hard'
            };
            
            const validCodes = OTP_CODES[difficultyMap[difficulty]];
            
            if (!validCodes.includes(code)) {
                return { valid: false, message: 'کد وارد شده نامعتبر است!' };
            }
            
            // بررسی استفاده نشده بودن
            if (isCodeUsed(code, difficulty)) {
                return { valid: false, message: 'این کد قبلاً استفاده شده است!' };
            }
            
            return { valid: true };
        }

        // انواع بافت خاک
        const soilTypes = ["سنگین", "متوسط", "سبک"];
        
        // انواع توپوگرافی
        const topographyTypes = ["کوهستانی", "کوهپایه‌ای و تپه‌ماهوری", "دشتی"];
        
        // صداهای رویدادها
        const positiveSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
        const negativeSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-sad-game-over-trombone-471.mp3');
        
        // پارامترهای تأثیر اقدامات بر اساس سطح دشواری
        const actionEffects = {
            'easy': {
                'contour': { veg: 8, erosion: -15, cost: 200, capacityIncrease: 3, score: 5 },
                'seeding': { veg: 5, erosion: -5, cost: 50, capacityIncrease: 2, score: 3 },
                'hill': { veg: 12, erosion: -12, cost: 300, capacityIncrease: 4, score: 7 },
                'sapling': { veg: 18, erosion: -10, cost: 400, capacityIncrease: 5, score: 10 },
                'water': { veg: 6, erosion: -3, cost: 150, score: 2 },
                'fence': { veg: 8, erosion: -8, cost: 300, score: 5 },
                'grazing-system': { cost: 200, score: 3 },
                'research': { cost: 200, score: 5 }
            },
            'medium': {
                'contour': { veg: 6, erosion: -12, cost: 200, capacityIncrease: 2, score: 3 },
                'seeding': { veg: 4, erosion: -4, cost: 50, capacityIncrease: 1, score: 2 },
                'hill': { veg: 9, erosion: -9, cost: 300, capacityIncrease: 3, score: 5 },
                'sapling': { veg: 14, erosion: -8, cost: 400, capacityIncrease: 4, score: 7 },
                'water': { veg: 5, erosion: -2, cost: 150, score: 1 },
                'fence': { veg: 6, erosion: -6, cost: 300, score: 3 },
                'grazing-system': { cost: 200, score: 2 },
                'research': { cost: 200, score: 3 }
            },
            'hard': {
                'contour': { veg: 4, erosion: -8, cost: 200, capacityIncrease: 1, score: 2 },
                'seeding': { veg: 3, erosion: -3, cost: 50, capacityIncrease: 1, score: 1 },
                'hill': { veg: 6, erosion: -6, cost: 300, capacityIncrease: 2, score: 3 },
                'sapling': { veg: 10, erosion: -5, cost: 400, capacityIncrease: 3, score: 5 },
                'water': { veg: 4, erosion: -1, cost: 150, score: 1 },
                'fence': { veg: 4, erosion: -4, cost: 300, score: 2 },
                'grazing-system': { cost: 200, score: 1 },
                'research': { cost: 200, score: 2 }
            }
        };
        
        // رویدادهای منفی
        const negativeEvents = [
            {
                title: "🌵 خشکسالی",
                description: "خشکسالی شدیدی رخ داده است. میزان آب در دسترس کاهش یافته و گیاهان تحت فشار قرار گرفته‌اند.",
                effect: function() {
                    vegetation -= 15;
                    erosion += 10;
                    degradeTiles(Math.ceil(tileCount / 4));
                    // کاهش تعداد دام مجاز در همه قطعات
                    tiles.forEach(tile => {
                        tile.dataset.capacity = Math.max(parseInt(tile.dataset.capacity) - 4, 1).toString();
                    });
                    addEvent("ظرفیت مجاز دام به دلیل خشکسالی کاهش یافت.");
                    farmerSatisfaction -= 15;
                    updateFarmerSatisfaction();
                    
                    // بررسی تخریب اقدامات قبلی
                    checkDestroyedActions();
                }
            },
            {
                title: "🔥 آتش سوزی در مراتع",
                description: "بخشی از مراتع دچار آتش سوزی شده است. پوشش گیاهی آسیب دیده و خاک در معرض فرسایش قرار گرفته است.",
                effect: function() {
                    vegetation -= 20;
                    erosion += 15;
                    degradeTiles(Math.ceil(tileCount / 3));
                    // کاهش تعداد دام مجاز در همه قطعات
                    tiles.forEach(tile => {
                        tile.dataset.capacity = Math.max(parseInt(tile.dataset.capacity) - 4, 1).toString();
                    });
                    addEvent("ظرفیت مجاز دام به دلیل آتش‌سوزی کاهش یافت.");
                    farmerSatisfaction -= 20;
                    updateFarmerSatisfaction();
                    
                    // بررسی تخریب اقدامات قبلی
                    checkDestroyedActions();
                }
            },
            {
                title: "💰 مشکلات اقتصادی",
                description: "مردم منطقه با مشکلات اقتصادی مواجه شده‌اند. فشار چرا افزایش یافته و بهره‌برداری بی‌رویه از مراتع افزایش پیدا کرده است.",
                effect: function() {
                    vegetation -= 10;
                    degradeTiles(Math.ceil(tileCount / 5));
                    // افزایش تعداد دام موجود در همه قطعات
                    tiles.forEach(tile => {
                        let currentCattle = parseInt(tile.dataset.cattle);
                        tile.dataset.cattle = Math.min(currentCattle + 7, 30).toString();
                        updateTileDisplay(tile);
                    });
                    addEvent("تعداد دام به دلیل مشکلات اقتصادی افزایش یافت.");
                    farmerSatisfaction -= 10;
                    updateFarmerSatisfaction();
                }
            },
            {
                title: "🚫 تحریم‌های بین‌المللی",
                description: "تحریم‌های جدید باعث کاهش درآمد صادرات محصولات مرتعی شده است.",
                effect: function() {
                    budget -= 400;
                    if (budget < 0) {
                        addEvent("بودجه شما منفی شد! باید سریعاً اقدام کنید.");
                    } else {
                        addEvent("درآمد صادرات به دلیل تحریم‌ها کاهش یافت.");
                    }
                    farmerSatisfaction -= 5;
                    updateFarmerSatisfaction();
                }
            },
            {
                title: "📉 ارزان شدن دام",
                description: "قیمت دام در بازار کاهش یافته و دامداران دام بیشتری وارد مراتع کرده‌اند.",
                effect: function() {
                    tiles.forEach(tile => {
                        let currentCattle = parseInt(tile.dataset.cattle);
                        tile.dataset.cattle = Math.min(currentCattle + 4, 30).toString();
                        updateTileDisplay(tile);
                    });
                    addEvent("تعداد دام به دلیل کاهش قیمت افزایش یافت.");
                    farmerSatisfaction -= 8;
                    updateFarmerSatisfaction();
                }
            },
            {
                title: "📈 گران شدن خوراک و واکسن",
                description: "قیمت خوراک دام و واکسن‌ها به شدت افزایش یافته است.",
                effect: function() {
                    budget -= 300;
                    if (budget < 0) {
                        addEvent("بودجه شما منفی شد! هزینه‌های خوراک و واکسن افزایش یافت.");
                    } else {
                        addEvent("هزینه‌های شما به دلیل افزایش قیمت خوراک و واکسن افزایش یافت.");
                    }
                    farmerSatisfaction -= 12;
                    updateFarmerSatisfaction();
                }
            },
            {
                title: "🦠 همه‌گیری بیماری دامی",
                description: "یک بیماری مسری در میان دام‌ها شیوع پیدا کرده است.",
                effect: function() {
                    budget -= 200;
                    vegetation -= 10;
                    if (budget < 0) {
                        addEvent("بودجه شما منفی شد! هزینه‌های درمان افزایش یافت و پوشش گیاهی کاهش یافت.");
                    } else {
                        addEvent("به دلیل شیوع بیماری، هزینه‌های درمان افزایش یافت و پوشش گیاهی کاهش یافت.");
                    }
                    farmerSatisfaction -= 15;
                    updateFarmerSatisfaction();
                }
            }
        ];
        
        // رویدادهای مثبت
        const positiveEvents = [
            {
                title: "🌧️ ترسالی",
                description: "بارندگی‌های مناسبی در منطقه رخ داده است. رطوبت خاک افزایش یافته و شرایط برای رشد گیاهان مساعد شده است.",
                effect: function() {
                    vegetation += 15;
                    erosion -= 10;
                    improveTiles(Math.ceil(tileCount / 4));
                    // افزایش تعداد دام مجاز در همه قطعات
                    tiles.forEach(tile => {
                        tile.dataset.capacity = (parseInt(tile.dataset.capacity) + 3).toString();
                    });
                    addEvent("ظرفیت مجاز دام به دلیل ترسالی افزایش یافت.");
                    farmerSatisfaction += 10;
                    updateFarmerSatisfaction();
                }
            },
            {
                title: "🎁 یارانه سوخت",
                description: "دولت یارانه سوخت به دامداران اختصاص داده است. استفاده از چوب درختان و بوته‌ها برای سوخت کاهش یافته است.",
                effect: function() {
                    vegetation += 10;
                    budget += 200;
                    improveTiles(Math.ceil(tileCount / 5));
                    addEvent("یارانه سوخت باعث کاهش فشار بر مراتع شد.");
                    farmerSatisfaction += 15;
                    updateFarmerSatisfaction();
                }
            },
            {
                title: "💼 افزایش اشتغال پایدار",
                description: "با راه‌اندازی صنایع جدید در منطقه، اشتغال پایدار افزایش یافته و فشار بر مراتع کاهش پیدا کرده است.",
                effect: function() {
                    vegetation += 8;
                    // کاهش تعداد دام موجود در همه قطعات
                    tiles.forEach(tile => {
                        let currentCattle = parseInt(tile.dataset.cattle);
                        tile.dataset.cattle = Math.max(currentCattle - 3, 0).toString();
                        updateTileDisplay(tile);
                    });
                    improveTiles(Math.ceil(tileCount / 5));
                    addEvent("اشتغال پایدار باعث کاهش فشار چرا شد.");
                    farmerSatisfaction += 20;
                    updateFarmerSatisfaction();
                }
            },
            {
                title: "🎓 انتخاب نماینده آگاه",
                description: "دامداران منطقه یک نماینده آگاه و باسواد انتخاب کرده‌اند که امکان مذاکره و آموزش را فراهم می‌کند.",
                effect: function() {
                    // کاهش تعداد دام موجود در همه قطعات
                    tiles.forEach(tile => {
                        let currentCattle = parseInt(tile.dataset.cattle);
                        tile.dataset.cattle = Math.max(currentCattle - 3, 0).toString();
                        updateTileDisplay(tile);
                    });
                    addEvent("نماینده دامداران باعث کاهش فشار چرا شد.");
                    farmerSatisfaction += 25;
                    updateFarmerSatisfaction();
                }
            }
        ];
        
        // راه‌اندازی اولیه بازی
        function initializeGame() {
            const map = document.getElementById('range-map');
            map.innerHTML = '';
            tiles = [];
            lastActions = [];
            initialTilesData = [];
            farmerSatisfaction = 50;
            lastGrazingSystemYear = 0;
            gameHistory = {
                vegetation: [],
                erosion: [],
                budget: [],
                score: [],
                seasons: [],
                farmerSatisfaction: []
            };
            
            map.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
            map.style.gridTemplateRows = `repeat(${gridRows}, 1fr)`;
            
            for (let i = 0; i < tileCount; i++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                
                const status = Math.random();
                tile.dataset.vegetation = Math.floor(Math.random() * 100).toString();
                tile.dataset.erosion = Math.floor(Math.random() * 50).toString();
                tile.dataset.capacity = (Math.floor(Math.random() * 10) + 5).toString();
                tile.dataset.cattle = (Math.floor(Math.random() * 15) + 5).toString();
                tile.dataset.erosionCount = "0";
                
                // تعیین بافت خاک تصادفی
                tile.dataset.soilType = soilTypes[Math.floor(Math.random() * soilTypes.length)];
                
                // تعیین توپوگرافی تصادفی
                tile.dataset.topography = topographyTypes[Math.floor(Math.random() * topographyTypes.length)];
                
                if (status < 0.2) {
                    tile.classList.add('critical');
                    tile.dataset.status = 'critical';
                } else if (status < 0.5) {
                    tile.classList.add('degraded');
                    tile.dataset.status = 'degraded';
                } else if (status < 0.8) {
                    tile.classList.add('recovering');
                    tile.dataset.status = 'recovering';
                } else {
                    tile.classList.add('healthy');
                    tile.dataset.status = 'healthy';
                }
                
                tile.textContent = (i + 1).toString();
                
                tile.addEventListener('click', function() {
                    selectTile(tile, i + 1);
                });
                
                map.appendChild(tile);
                tiles.push(tile);
                initialTilesData.push({
                    vegetation: tile.dataset.vegetation,
                    erosion: tile.dataset.erosion,
                    status: tile.dataset.status,
                    cattle: tile.dataset.cattle,
                    capacity: tile.dataset.capacity
                });
                updateTileDisplay(tile);
            }
            
            // ذخیره وضعیت اولیه برای تاریخچه
            gameHistory.vegetation.push(vegetation);
            gameHistory.erosion.push(erosion);
            gameHistory.budget.push(budget);
            gameHistory.score.push(score);
            gameHistory.farmerSatisfaction.push(farmerSatisfaction);
            gameHistory.seasons.push(`${seasons[season]} سال ${year}`);
            
            updateFarmerSatisfaction();
            
            // ذخیره سلامت اولیه
            initialAverageHealth = tiles.reduce((sum, tile) => sum + parseInt(tile.dataset.vegetation), 0) / tiles.length;
            
            addEvent("بازی شروع شد. شما مدیریت این مرتع را به عهده گرفتید.");
        }
        
        // به‌روزرسانی نمایش رضایت دامداران
        function updateFarmerSatisfaction() {
            farmerSatisfaction = Math.max(0, Math.min(farmerSatisfaction, 100));
            document.getElementById('farmer-satisfaction-value').textContent = farmerSatisfaction + '%';
            document.getElementById('farmer-satisfaction-bar').style.width = farmerSatisfaction + '%';
            
            // تغییر رنگ بر اساس سطح رضایت
            const bar = document.getElementById('farmer-satisfaction-bar');
            if (farmerSatisfaction > 70) {
                bar.style.backgroundColor = '#4caf50';
            } else if (farmerSatisfaction > 40) {
                bar.style.backgroundColor = '#ff9800';
            } else {
                bar.style.backgroundColor = '#f44336';
            }
        }
        
        // انتخاب یک قطعه زمین
        function selectTile(tile, number) {
            // حذف انتخاب قبلی
            tiles.forEach(t => t.style.border = 'none');
            
            // انتخاب قطعه جدید
            selectedTile = tile;
            tile.style.border = '2px solid #ff9800';
            
            // نمایش اطلاعات قطعه
            const capacity = tile.dataset.capacity;
            const cattle = tile.dataset.cattle;
            const overgrazing = cattle > capacity ? 'بله' : 'خیر';
            
            document.getElementById('selected-tile-info').style.display = 'block';
            document.getElementById('tile-details').innerHTML = `
                <p>قطعه ${number}: وضعیت ${getTileStatusName(tile.dataset.status)}</p>
                <p>پوشش گیاهی: ${tile.dataset.vegetation}%</p>
                <p>فرسایش خاک: ${tile.dataset.erosion}%</p>
                <p>ظرفیت مجاز دام: ${capacity} راس</p>
                <p>تعداد دام موجود: ${cattle} راس</p>
                <p>چرای بیش از حد: ${overgrazing}</p>
                <p>بافت خاک: ${tile.dataset.soilType}</p>
                <p>توپوگرافی: ${tile.dataset.topography}</p>
            `;
            
            // نمایش دکمه‌های اقدام
            document.getElementById('action-buttons').style.display = 'flex';
            
            addEvent(`قطعه ${number} انتخاب شد.`);
        }
        
        // شروع تایمر فصلی
        function startTimer() {
            clearInterval(timerInterval);
            timerValue = 30;
            document.getElementById('timer').textContent = timerValue;
            
            timerInterval = setInterval(function() {
                timerValue--;
                document.getElementById('timer').textContent = timerValue;
                
                if (timerValue <= 0) {
                    clearInterval(timerInterval);
                    addEvent("زمان این فصل به پایان رسید!");
                    nextSeason();
                }
            }, 1000);
        }
        
        // اجرای اقدامات مدیریتی
        function performAction(action) {
            if (!selectedTile) {
                showWarning("هشدار", "لطفاً ابتدا یک قطعه زمین را انتخاب کنید!");
                return;
            }
            
            const effect = actionEffects[difficulty][action];
            
            // بررسی بودجه
            if (budget < effect.cost) {
                showWarning("هشدار", "بودجه کافی نیست!");
                return;
            }
            
            // بررسی محدودیت‌های خاص
            if (action === 'contour' && selectedTile.dataset.topography === 'کوهستانی') {
                budget -= effect.cost;
                const tileNum = tiles.indexOf(selectedTile) + 1;
                recordDecision('management', 'کنتورفارو', tileNum, effect.cost, 'هدر رفت - کوهستانی');
                showWarning("هشدار", "شما بودجه را در عملیات نادرست هزینه کرده و هدر دادید. کنتورفارو در مناطق کوهستانی مؤثر نیست!");
                updateDisplay();
                return;
            }
            
            if (action === 'water' && season !== 1) { // 1 = تابستان
                budget -= effect.cost;
                const tileNum = tiles.indexOf(selectedTile) + 1;
                recordDecision('management', 'آبیاری تکمیلی', tileNum, effect.cost, 'هدر رفت - فصل نامناسب');
                showWarning("هشدار", "شما بودجه را در عملیات نادرست هزینه کرده و هدر دادید. آبیاری تکمیلی فقط در تابستان مؤثر است!");
                updateDisplay();
                return;
            }
            
            // بررسی محدودیت فصلی برای اقدامات کاشت
            if (season === 1 && ['contour', 'seeding', 'hill', 'sapling'].includes(action)) {
                budget -= effect.cost;
                const tileNum = tiles.indexOf(selectedTile) + 1;
                const actionNames = {
                    'contour': 'کنتورفارو',
                    'seeding': 'بذرپاشی', 
                    'hill': 'کپه‌کاری',
                    'sapling': 'نهالکاری'
                };
                recordDecision('management', actionNames[action], tileNum, effect.cost, 'هدر رفت - تابستان');
                showWarning("هشدار", "تابستان زمان مناسبی برای اجرای عملیات کاشت در مرتع نیست، بودجه مصرفی هدر رفت");
                updateDisplay();
                return;
            }
            
            // کاهش بودجه
            budget -= effect.cost;
            
            // اعمال تأثیر اقدام
            switch(action) {
                case 'contour':
                case 'seeding':
                case 'hill':
                case 'sapling':
                case 'water':
                case 'fence':
                    const currentVeg = parseInt(selectedTile.dataset.vegetation);
                    const currentErosion = parseInt(selectedTile.dataset.erosion);
                    
                    // محاسبه اثر رضایت دامداران (بین 0.5 تا 1.5)
                    const satisfactionEffect = 0.5 + (farmerSatisfaction / 100);
                    
                    selectedTile.dataset.vegetation = Math.max(0, Math.min(currentVeg + Math.round(effect.veg * satisfactionEffect), 100)).toString();
                    selectedTile.dataset.erosion = Math.max(0, Math.min(currentErosion + Math.round(effect.erosion * satisfactionEffect), 100)).toString();
                    
                    // افزایش ظرفیت چرا برای برخی اقدامات
                    if (['contour', 'seeding', 'hill', 'sapling'].includes(action)) {
                        let increaseAmount = effect.capacityIncrease;
                        
                        // اگر سطح تحقیق به 4 رسیده باشد، اثر 1.5 برابر می‌شود
                        if (researchLevel >= 4) {
                            increaseAmount = Math.floor(increaseAmount * 1.5);
                            addEvent(`سطح تحقیق بالا! اثر ${getActionName(action)} بر ظرفیت چرا 1.5 برابر شد.`);
                        }
                        
                        const currentCapacity = parseInt(selectedTile.dataset.capacity);
                        selectedTile.dataset.capacity = (currentCapacity + increaseAmount).toString();
                    }
                    
                    // افزودن انیمیشن
                    selectedTile.classList.add('tile-animation');
                    setTimeout(() => {
                        selectedTile.classList.remove('tile-animation');
                    }, 2000);
                    
                    updateTileStatus(selectedTile);
                    addEvent(`اقدام ${getActionName(action)} بر روی قطعه ${tiles.indexOf(selectedTile) + 1} انجام شد.`);
                    
                    // ذخیره اقدام برای بررسی در فصل بعد
                    if (['contour', 'seeding', 'hill', 'sapling'].includes(action)) {
                        lastActions.push({
                            action: action,
                            tileIndex: tiles.indexOf(selectedTile),
                            season: season,
                            year: year
                        });
                    }
                    
                    // افزایش امتیاز
                    score += effect.score;
                    break;
                    
                case 'fence':
                    // کاهش تعداد دام در قطعه انتخاب شده
                    let currentCattle = parseInt(selectedTile.dataset.cattle);
                    selectedTile.dataset.cattle = Math.max(currentCattle - 5, 0).toString(); // کاهش 5 واحدی دام
                    updateTileDisplay(selectedTile);
                    addEvent("تامین علوفه جایگزین و محدود کردن چرا انجام شد. فشار چرا کاهش یافت.");
                    
                    // افزایش امتیاز
                    score += effect.score;
                    break;
                    
                case 'grazing-system':
                    // بررسی اینکه آیا در این سال قبلاً استفاده شده یا نه
                    if (lastGrazingSystemYear === year) {
                        showWarning("هشدار", "شما قبلاً در این سال از سیستم چرای دام استفاده کرده‌اید!");
                        budget += effect.cost; // بازگرداندن بودجه
                        return;
                    }
                    
                    lastGrazingSystemYear = year;
                    
                    // کاهش تعداد دام در همه قطعات بر اساس سطح دشواری
                    let cattleReduction;
                    if (difficulty === 'easy') {
                        cattleReduction = 3;
                    } else if (difficulty === 'medium') {
                        cattleReduction = 2;
                    } else {
                        cattleReduction = 1;
                    }
                    
                    tiles.forEach(tile => {
                        let currentCattle = parseInt(tile.dataset.cattle);
                        tile.dataset.cattle = Math.max(currentCattle - cattleReduction, 0).toString();
                        updateTileDisplay(tile);
                    });
                    
                    addEvent(`سیستم چرای دام متناسب با منطقه اجرا شد. تعداد دام در همه قطعات ${cattleReduction} واحد کاهش یافت.`);
                    
                    // افزایش رضایت دامداران
                    farmerSatisfaction += 5;
                    updateFarmerSatisfaction();
                    
                    // افزایش امتیاز
                    score += effect.score;
                    break;
                    
                case 'research':
                    researchLevel++;
                    document.getElementById('research-level').textContent = researchLevel;
                    addEvent(`تحقیقات جدید انجام شد! سطح دانش به ${researchLevel} رسید. روش‌های جدید اصلاح مرتع در دسترس است.`);
                    
                    // افزایش امتیاز
                    score += effect.score;
                    break;
            }
            
            // ثبت تصمیم موفق
            const tileNum = tiles.indexOf(selectedTile) + 1;
            const actionNames = {
                'contour': 'کنتورفارو',
                'seeding': 'بذرپاشی',
                'hill': 'کپه‌کاری', 
                'sapling': 'نهالکاری',
                'water': 'آبیاری تکمیلی',
                'fence': 'علوفه جایگزین و محدود کردن چرا',
                'grazing-system': 'سیستم چرای متناسب',
                'research': 'تحقیق و توسعه'
            };
            recordDecision('management', actionNames[action] || action, tileNum, effect.cost, 'موفق');
            
            // ثبت نوع اقدام برای محاسبه تنوع
            uniqueActions.add(action);
            
            // ثبت زمان باقیمانده (برای محاسبه سرعت)
            decisionTimes.push(timerValue);
            
            // به‌روزرسانی نمایش
            updateDisplay();
            calculateScore();
        }
        
        // نمایش هشدار
        function showWarning(title, message) {
            const popup = document.getElementById('warning-popup');
            const overlay = document.getElementById('overlay');
            
            document.getElementById('warning-title').textContent = title;
            document.getElementById('warning-message').textContent = message;
            
            popup.style.display = 'block';
            overlay.style.display = 'block';
        }
        
        // بررسی تخریب اقدامات قبلی در صورت وقوع خشکسالی یا آتش سوزی
        function checkDestroyedActions() {
            if (lastActions.length === 0) return;
            
            let destroyed = false;
            const currentSeason = season;
            const currentYear = year;
            
            // بررسی اقدامات فصل قبل
            for (let i = lastActions.length - 1; i >= 0; i--) {
                const action = lastActions[i];
                
                // اگر اقدام در فصل قبل انجام شده باشد
                if ((action.year === currentYear && action.season === (currentSeason - 1)) || 
                    (currentSeason === 0 && action.year === (currentYear - 1) && action.season === 3)) {
                    
                    // تخریب اقدام
                    const tile = tiles[action.tileIndex];
                    const effect = actionEffects[difficulty][action.action];
                    
                    // برگرداندن اثرات اقدام
                    tile.dataset.vegetation = Math.max(0, parseInt(tile.dataset.vegetation) - effect.veg).toString();
                    tile.dataset.erosion = Math.min(100, parseInt(tile.dataset.erosion) - effect.erosion).toString();
                    
                    // برگرداندن اثر بر ظرفیت چرا
                    if (['contour', 'seeding', 'hill', 'sapling'].includes(action.action)) {
                        let decreaseAmount = effect.capacityIncrease;
                        if (researchLevel >= 4) {
                            decreaseAmount = Math.floor(decreaseAmount * 1.5);
                        }
                        tile.dataset.capacity = Math.max(parseInt(tile.dataset.capacity) - decreaseAmount, 1).toString();
                    }
                    
                    updateTileStatus(tile);
                    
                    // حذف از لیست اقدامات
                    lastActions.splice(i, 1);
                    destroyed = true;
                }
            }
            
            if (destroyed) {
                addEvent("متاسفانه با خشکسالی/آتش‌سوزی رخ داده، اثر فعالیت فصل قبل شما از بین رفت");
            }
        }
        
        // شروع درآمد جایگزین
        function startAlternativeIncome(type, cost, income) {
            // بررسی بودجه
            if (budget < cost) {
                showWarning("هشدار", "بودجه کافی نیست!");
                return;
            }
            
            // بررسی تکراری نبودن
            if (type === 'herbs' && hasHerbs) {
                showWarning("هشدار", "شما قبلاً در زمینه گیاهان دارویی سرمایه‌گذاری کرده‌اید!");
                return;
            }
            if (type === 'tourism' && hasTourism) {
                showWarning("هشدار", "شما قبلاً در زمینه گردشگری طبیعت سرمایه‌گذاری کرده‌اید!");
                return;
            }
            if (type === 'beekeeping' && hasBeekeeping) {
                showWarning("هشدار", "شما قبلاً در زمینه زنبورداری سرمایه‌گذاری کرده‌اید!");
                return;
            }
            if (type === 'livestock' && hasLivestock) {
                showWarning("هشدار", "شما قبلاً در زمینه دامداری سرمایه‌گذاری کرده‌اید!");
                return;
            }
            if (type === 'other-invest' && hasOtherInvest) {
                showWarning("هشدار", "شما قبلاً در سایر سرمایه‌گذاری‌ها سرمایه‌گذاری کرده‌اید!");
                return;
            }
            
            // کاهش بودجه
            budget -= cost;
            
            // تعیین نام فارسی
            const incomeNames = {
                'herbs': 'پرورش گیاهان دارویی',
                'tourism': 'توسعه گردشگری طبیعت',
                'beekeeping': 'زنبورداری',
                'livestock': 'دامداری',
                'other-invest': 'سایر سرمایه‌گذاری‌ها'
            };
            
            // ثبت تصمیم درآمد جایگزین
            recordDecision('alternative_income', incomeNames[type] || type, null, cost, 'موفق');
            
            // افزودن درآمد
            switch(type) {
                case 'herbs':
                    hasHerbs = true;
                    altIncome += income;
                    addEvent("شما در پرورش گیاهان دارویی سرمایه‌گذاری کردید. درآمد جایگزین شما افزایش یافت.");
                    break;
                case 'tourism':
                    hasTourism = true;
                    altIncome += income;
                    addEvent("شما در توسعه گردشگری طبیعت سرمایه‌گذاری کردید. درآمد جایگزین شما افزایش یافت.");
                    break;
                case 'beekeeping':
                    hasBeekeeping = true;
                    altIncome += income;
                    addEvent("شما در زنبورداری سرمایه‌گذاری کردید. درآمد جایگزین شما افزایش یافت.");
                    break;
                case 'livestock':
                    hasLivestock = true;
                    altIncome += income;
                    addEvent("شما در دامداری سرمایه‌گذاری کردید. درآمد جایگزین شما افزایش یافت.");
                    break;
                case 'other-invest':
                    hasOtherInvest = true;
                    altIncome += income;
                    addEvent("شما در سایر سرمایه‌گذاری‌ها سرمایه‌گذاری کردید. درآمد جایگزین شما افزایش یافت.");
                    break;
            }
            
            // به‌روزرسانی نمایش
            updateDisplay();
        }
        
        // رفتن به فصل بعد
        function nextSeason() {
            clearInterval(timerInterval);
            
            // افزایش درآمد جایگزین
            budget += altIncome;
            if (altIncome > 0) {
                addEvent(`شما ${altIncome} واحد درآمد از منابع جایگزین کسب کردید.`);
            }
            
            // افزایش فصل و سال
            season = (season + 1) % 4;
            if (season === 0) {
                year++;
            }
            
            // ذخیره تاریخچه
            gameHistory.vegetation.push(vegetation);
            gameHistory.erosion.push(erosion);
            gameHistory.budget.push(budget);
            gameHistory.score.push(score);
            gameHistory.farmerSatisfaction.push(farmerSatisfaction);
            gameHistory.seasons.push(`${seasons[season]} سال ${year}`);
            
            // احتمال رخ دادن رویدادها
            if (Math.random() < 0.3) {
                if (Math.random() < 0.6) {
                    triggerEvent(negativeEvents[Math.floor(Math.random() * negativeEvents.length)], false);
                } else {
                    triggerEvent(positiveEvents[Math.floor(Math.random() * positiveEvents.length)], true);
                }
            }
            
            // محاسبه تغییرات طبیعی فصلی
            calculateSeasonalChanges();
            
            // اعمال تأثیر تحقیق
            if (researchLevel > 0) {
                improveVegetation(researchLevel);
                decreaseErosion(researchLevel);
            }

            // بررسی فرسایش خاک در طول زمان
            checkLongTermErosion();
            
            // به‌روزرسانی نمایش
            updateDisplay();
            calculateScore();
            startTimer();
            
            
            // نمایش نکته روز (هر 8 فصل)
            showDailyTip();
            
            // محاسبه و ذخیره نمره
            calculateStudentGrade();
            
            addEvent(`فصل جدید شروع شد: ${seasons[season]} سال ${year}`);
            
            // بررسی پایان بازی
            if (year >= 10) {
                endGame();
            }
        }
        
        // بررسی فرسایش خاک در طول زمان
        function checkLongTermErosion() {
            tiles.forEach(tile => {
                const erosion = parseInt(tile.dataset.erosion);
                const vegetation = parseInt(tile.dataset.vegetation);
                
                // اگر فرسایش بیش از 60% در 12 فصل باشد
                if (erosion > 60) {
                    tile.dataset.erosionCount = (parseInt(tile.dataset.erosionCount || 0) + 1).toString();
                    
                    if (parseInt(tile.dataset.erosionCount) >= 12) {
                        tile.dataset.vegetation = Math.max(0, vegetation - 10).toString();
                        addEvent(`به دلیل فرسایش شدید در قطعه ${tiles.indexOf(tile) + 1}، پوشش گیاهی 10% کاهش یافت.`);
                        updateTileStatus(tile);
                    }
                } else {
                    tile.dataset.erosionCount = "0";
                }
            });
        }
        
        // فعال‌سازی رویداد
        function triggerEvent(event, isPositive) {
            event.effect();
            
            const popup = document.getElementById('event-popup');
            const overlay = document.getElementById('overlay');
            
            document.getElementById('event-title').textContent = event.title;
            document.getElementById('event-description').textContent = event.description;
            
            popup.className = 'event-popup';
            if (isPositive) {
                popup.classList.add('positive-event');
                positiveSound.play().catch(e => console.log("Error playing sound:", e));
            } else {
                popup.classList.add('negative-event');
                negativeSound.play().catch(e => console.log("Error playing sound:", e));
            }
            
            popup.style.display = 'block';
            overlay.style.display = 'block';
            
            // به‌روزرسانی وضعیت قطعات
            updateTiles();
            updateDisplay();
        }
        
        // بهبود پوشش گیاهی
        function improveVegetation(amount) {
            vegetation = Math.min(vegetation + amount, 100);
            updateDisplay();
        }
        
        // کاهش فرسایش خاک
        function decreaseErosion(amount) {
            erosion = Math.max(erosion - amount, 0);
            updateDisplay();
        }
        
        // بهبود وضعیت قطعات
        function improveTiles(count) {
            const availableTiles = [...tiles].sort(() => Math.random() - 0.5);
            const tilesToImprove = availableTiles.slice(0, count);
            
            tilesToImprove.forEach(tile => {
                const currentVeg = parseInt(tile.dataset.vegetation);
                const currentErosion = parseInt(tile.dataset.erosion);
                
                tile.dataset.vegetation = Math.min(currentVeg + 15, 100).toString();
                tile.dataset.erosion = Math.max(currentErosion - 10, 0).toString();
                
                updateTileStatus(tile);
            });
        }
        
        // تخریب وضعیت قطعات
        function degradeTiles(count) {
            const availableTiles = [...tiles].sort(() => Math.random() - 0.5);
            const tilesToDegrade = availableTiles.slice(0, count);
            
            tilesToDegrade.forEach(tile => {
                const currentVeg = parseInt(tile.dataset.vegetation);
                const currentErosion = parseInt(tile.dataset.erosion);
                
                tile.dataset.vegetation = Math.max(currentVeg - 15, 0).toString();
                tile.dataset.erosion = Math.min(currentErosion + 10, 100).toString();
                
                updateTileStatus(tile);
            });
        }
        
        // محاسبه تغییرات فصلی
        function calculateSeasonalChanges() {
            switch(season) {
                case 0: // بهار
                    vegetation += 5;
                    erosion -= 2;
                    break;
                case 1: // تابستان
                    vegetation -= 3;
                    erosion += 3;
                    break;
                case 2: // پاییز
                    vegetation += 2;
                    erosion += 1;
                    break;
                case 3: // زمستان
                    vegetation -= 1;
                    erosion += 2;
                    break;
            }
            
            vegetation = Math.max(0, Math.min(vegetation, 100));
            erosion = Math.max(0, Math.min(erosion, 100));
            
            tiles.forEach(tile => {
                const currentVeg = parseInt(tile.dataset.vegetation);
                const currentErosion = parseInt(tile.dataset.erosion);
                const currentCattle = parseInt(tile.dataset.cattle);
                const capacity = parseInt(tile.dataset.capacity);
                
                let vegChange = 0;
                let erosionChange = 0;
                
                if (currentCattle > capacity) {
                    vegChange -= (currentCattle - capacity) * 2;
                    erosionChange += (currentCattle - capacity);
                }
                
                switch(season) {
                    case 0: // بهار
                        vegChange += 5;
                        erosionChange -= 2;
                        break;
                    case 1: // تابستان
                        vegChange -= 3;
                        erosionChange += 3;
                        break;
                    case 2: // پاییز
                        vegChange += 2;
                        erosionChange += 1;
                        break;
                    case 3: // زمستان
                        vegChange -= 1;
                        erosionChange += 2;
                        break;
                }
                
                tile.dataset.vegetation = Math.max(0, Math.min(currentVeg + vegChange, 100)).toString();
                tile.dataset.erosion = Math.max(0, Math.min(currentErosion + erosionChange, 100)).toString();
                
                updateTileStatus(tile);
            });
        }
        
        // به‌روزرسانی وضعیت قطعه
        function updateTileStatus(tile) {
            tile.classList.remove('critical', 'degraded', 'recovering', 'healthy');
            
            const veg = parseInt(tile.dataset.vegetation);
            
            if (veg < 20) {
                tile.classList.add('critical');
                tile.dataset.status = 'critical';
            } else if (veg < 40) {
                tile.classList.add('degraded');
                tile.dataset.status = 'degraded';
            } else if (veg < 70) {
                tile.classList.add('recovering');
                tile.dataset.status = 'recovering';
            } else {
                tile.classList.add('healthy');
                tile.dataset.status = 'healthy';
            }
            
            updateTileDisplay(tile);
        }
        
        // به‌روزرسانی نمایش قطعه
        function updateTileDisplay(tile) {
            const index = tiles.indexOf(tile);
            const cattle = tile.dataset.cattle;
            const capacity = tile.dataset.capacity;
            const soilType = tile.dataset.soilType;
            const topography = tile.dataset.topography;
            
            // آیکون‌ها برای نوع خاک
            const soilIcons = {
                'سنگین': '🪨',
                'متوسط': '🌾',
                'سبک': '💨'
            };
            
            // آیکون‌ها برای توپوگرافی
            const topoIcons = {
                'کوهستانی': '⛰️',
                'کوهپایه‌ای و تپه‌ماهوری': '🏔️',
                'دشتی': '🌄'
            };
            
            tile.innerHTML = `
                <div style="font-weight: bold; font-size: 16px; margin-bottom: 3px;">${index + 1}</div>
                <div class="cattle-info" style="font-size: 13px; margin: 2px 0;">
                    🐑 ${cattle}/${capacity}
                </div>
                <div class="soil-type" style="font-size: 11px; margin: 2px 0;">
                    ${soilIcons[soilType] || ''} ${soilType}
                </div>
                <div class="topography" style="font-size: 10px; margin: 2px 0; line-height: 1.2;">
                    ${topoIcons[topography] || ''} ${topography}
                </div>
            `;
        }
        
        // به‌روزرسانی همه قطعات
        function updateTiles() {
            tiles.forEach(tile => {
                updateTileStatus(tile);
            });
        }
        
        // به‌روزرسانی نمایش کلی
        function updateDisplay() {
            document.getElementById('budget').textContent = budget;
            document.getElementById('season').textContent = seasons[season];
            document.getElementById('year').textContent = year;
            document.getElementById('score').textContent = score;
            document.getElementById('alt-income').textContent = altIncome;
            document.getElementById('vegetation-status').textContent = vegetation + '%';
            document.getElementById('erosion-status').textContent = erosion + '%';
            document.getElementById('research-level').textContent = researchLevel;
            
            // به‌روزرسانی دکمه‌ها
            document.getElementById('contour-btn').disabled = budget < 200;
            document.getElementById('seeding-btn').disabled = budget < 50;
            document.getElementById('hill-btn').disabled = budget < 300;
            document.getElementById('sapling-btn').disabled = budget < 400;
            document.getElementById('water-btn').disabled = budget < 150 || season !== 1;
            document.getElementById('fence-btn').disabled = budget < 300;
            document.getElementById('grazing-system-btn').disabled = budget < 200 || lastGrazingSystemYear === year;
            document.getElementById('research-btn').disabled = budget < 200;
            document.getElementById('herbs-btn').disabled = budget < 700 || hasHerbs;
            document.getElementById('tourism-btn').disabled = budget < 900 || hasTourism;
            document.getElementById('beekeeping-btn').disabled = budget < 500 || hasBeekeeping;
            document.getElementById('livestock-btn').disabled = budget < 50 || hasLivestock;
            document.getElementById('other-invest-btn').disabled = budget < 700 || hasOtherInvest;
        }
        
        // افزودن رویداد به گزارش
        function addEvent(message) {
            const eventLog = document.getElementById('event-log');
            const entry = document.createElement('p');
            entry.textContent = `${seasons[season]}، سال ${year}: ${message}`;
            eventLog.appendChild(entry);
            eventLog.scrollTop = eventLog.scrollHeight;
        }
        
        // محاسبه امتیاز
        function calculateScore() {
            // محاسبه وضعیت قطعات
            let criticalCount = 0;
            let degradedCount = 0;
            let recoveringCount = 0;
            let healthyCount = 0;
            
            tiles.forEach(tile => {
                switch(tile.dataset.status) {
                    case 'critical':
                        criticalCount++;
                        break;
                    case 'degraded':
                        degradedCount++;
                        break;
                    case 'recovering':
                        recoveringCount++;
                        break;
                    case 'healthy':
                        healthyCount++;
                        break;
                }
            });
            
            // محاسبه امتیاز جدید
            score = (healthyCount * 3) + (recoveringCount * 2) - (criticalCount * 2) - (degradedCount * 1);
            
            // اضافه کردن امتیاز برای منابع جایگزین و تحقیقات
            score += altIncome * 0.5;
            score += researchLevel * (difficulty === 'easy' ? 5 : (difficulty === 'medium' ? 3 : 2));
            
            // اضافه کردن امتیاز برای رضایت دامداران
            score += Math.floor(farmerSatisfaction / 10);
            
            // اطمینان از مثبت بودن امتیاز
            score = Math.max(0, score);
            
            document.getElementById('score').textContent = score;
        }
        
        // تولید گزارش PDF
        function generatePDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // عنوان گزارش
            doc.setFontSize(18);
            doc.text('گزارش مدیریت مراتع', 105, 15, { align: 'center' });
            doc.setFontSize(12);
            doc.text(`تاریخ: ${new Date().toLocaleDateString('fa-IR')}`, 105, 25, { align: 'center' });
            
            // اطلاعات کلی
            doc.setFontSize(14);
            doc.text('اطلاعات کلی:', 15, 35);
            doc.setFontSize(12);
            
            let y = 45;
            doc.text(`امتیاز نهایی: ${score}`, 15, y);
            y += 10;
            doc.text(`سطح دشواری: ${getDifficultyName(difficulty)}`, 15, y);
            y += 10;
            doc.text(`سال پایانی: ${year}`, 15, y);
            y += 10;
            doc.text(`رضایت دامداران: ${farmerSatisfaction}%`, 15, y);
            y += 10;
            doc.text(`پوشش گیاهی کلی: ${vegetation}%`, 15, y);
            y += 10;
            doc.text(`فرسایش خاک کلی: ${erosion}%`, 15, y);
            y += 15;
            
            // وضعیت قطعات
            doc.setFontSize(14);
            doc.text('وضعیت قطعات مرتع:', 15, y);
            y += 10;
            doc.setFontSize(12);
            
            let criticalCount = 0;
            let degradedCount = 0;
            let recoveringCount = 0;
            let healthyCount = 0;
            
            tiles.forEach(tile => {
                switch(tile.dataset.status) {
                    case 'critical': criticalCount++; break;
                    case 'degraded': degradedCount++; break;
                    case 'recovering': recoveringCount++; break;
                    case 'healthy': healthyCount++; break;
                }
            });
            
            doc.text(`قطعات بحرانی: ${criticalCount}`, 15, y);
            y += 10;
            doc.text(`قطعات تخریب شده: ${degradedCount}`, 15, y);
            y += 10;
            doc.text(`قطعات در حال بهبود: ${recoveringCount}`, 15, y);
            y += 10;
            doc.text(`قطعات سالم: ${healthyCount}`, 15, y);
            y += 15;
            
            // تاریخچه رویدادها
            doc.setFontSize(14);
            doc.text('تاریخچه رویدادها:', 15, y);
            y += 10;
            doc.setFontSize(10);
            
            const eventLog = document.getElementById('event-log').querySelectorAll('p');
            eventLog.forEach(event => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(event.textContent, 15, y, { maxWidth: 180 });
                y += 10;
            });
            
            // ذخیره فایل
            doc.save(`گزارش_مدیریت_مراتع_${new Date().toLocaleDateString('fa-IR').replace(/\//g, '-')}.pdf`);
            
            addEvent("گزارش PDF با موفقیت تولید شد.");
        }
        
        // پایان بازی
        function endGame() {
            clearInterval(timerInterval);
            
            const popup = document.getElementById('end-game-popup');
            const overlay = document.getElementById('overlay');
            
            document.getElementById('end-game-title').textContent = "پایان بازی!";
            
            let message = `بازی به پایان رسید! امتیاز نهایی شما: ${score}<br><br>`;
            
            // محاسبه وضعیت کلی مراتع
            let totalVeg = 0;
            let totalErosion = 0;
            let criticalCount = 0;
            let degradedCount = 0;
            let recoveringCount = 0;
            let healthyCount = 0;
            
            tiles.forEach(tile => {
                totalVeg += parseInt(tile.dataset.vegetation);
                totalErosion += parseInt(tile.dataset.erosion);
                
                switch(tile.dataset.status) {
                    case 'critical':
                        criticalCount++;
                        break;
                    case 'degraded':
                        degradedCount++;
                        break;
                    case 'recovering':
                        recoveringCount++;
                        break;
                    case 'healthy':
                        healthyCount++;
                        break;
                }
            });
            
            const avgVeg = totalVeg / tiles.length;
            const avgErosion = totalErosion / tiles.length;
            
            message += `وضعیت نهایی مراتع:<br>`;
            message += `- میانگین پوشش گیاهی: ${avgVeg.toFixed(1)}%<br>`;
            message += `- میانگین فرسایش خاک: ${avgErosion.toFixed(1)}%<br>`;
            message += `- تعداد قطعات بحرانی: ${criticalCount}<br>`;
            message += `- تعداد قطعات تخریب شده: ${degradedCount}<br>`;
            message += `- تعداد قطعات در حال بهبود: ${recoveringCount}<br>`;
            message += `- تعداد قطعات سالم: ${healthyCount}<br><br>`;
            message += `- رضایت دامداران: ${farmerSatisfaction}%<br><br>`;
            
            if (score >= 150) {
                message += "عالی! شما یک مدیر مرتع استثنایی هستید. مراتع تحت مدیریت شما به پایداری کامل رسیده‌اند.";
            } else if (score >= 120) {
                message += "بسیار خوب! مدیریت شما باعث بهبود قابل توجه وضعیت مراتع شده است.";
            } else if (score >= 90) {
                message += "خوب! شما توانستید تعادل نسبی در مراتع ایجاد کنید.";
            } else if (score >= 60) {
                message += "قابل قبول. هنوز مراتع نیاز به مدیریت بهتری دارند.";
            } else {
                message += "متأسفانه مراتع در وضعیت بحرانی قرار دارند. مدیریت نیاز به بازنگری اساسی دارد.";
            }
            
            document.getElementById('final-stats').innerHTML = message;
            
            // ذخیره امتیاز بالا
            saveHighScore();
            
            // نمایش مقایسه وضعیت قطعات
            showTileComparison();
            
            // نمایش نمودارها
            showCharts();
            
            // نمایش امتیازهای بالا
            showHighScores();
            
            // نمایش لینک‌های آموزشی
            updateEducationalLinks();
            
            popup.style.display = 'block';
            overlay.style.display = 'block';
            
            // غیرفعال کردن دکمه‌ها
            document.getElementById('contour-btn').disabled = true;
            document.getElementById('seeding-btn').disabled = true;
            document.getElementById('hill-btn').disabled = true;
            document.getElementById('sapling-btn').disabled = true;
            document.getElementById('water-btn').disabled = true;
            document.getElementById('fence-btn').disabled = true;
            document.getElementById('grazing-system-btn').disabled = true;
            document.getElementById('research-btn').disabled = true;
            document.getElementById('next-season-btn').disabled = true;
            document.getElementById('herbs-btn').disabled = true;
            document.getElementById('tourism-btn').disabled = true;
            document.getElementById('beekeeping-btn').disabled = true;
            document.getElementById('livestock-btn').disabled = true;
            document.getElementById('other-invest-btn').disabled = true;
            
            // محاسبه و ذخیره نمره نهایی
            calculateStudentGrade();
            saveStudentGradeToHistory();
            
            addEvent(`بازی به پایان رسید! امتیاز نهایی شما: ${score} - نمره: ${studentGrade}/100`);
        }
        
        // به‌روزرسانی لینک‌های آموزشی
        function updateEducationalLinks() {
            const container = document.getElementById('educational-links');
            container.innerHTML = '<h3>منابع آموزشی بیشتر</h3><ul>';
            
            educationalLinks.forEach(link => {
                container.innerHTML += `<li><a href="${link.url}" target="_blank">${link.title}</a></li>`;
            });
            
            container.innerHTML += '</ul>';
        }
        
        // ذخیره امتیاز بالا
        function saveHighScore() {
            if (!highScores[tileCount]) {
                highScores[tileCount] = [];
            }
            
            highScores[tileCount].push({
                score: score,
                difficulty: difficulty,
                date: new Date().toLocaleDateString('fa-IR')
            });
            
            // مرتب سازی بر اساس امتیاز
            highScores[tileCount].sort((a, b) => b.score - a.score);
            
            // نگه داشتن فقط 5 امتیاز برتر
            if (highScores[tileCount].length > 5) {
                highScores[tileCount] = highScores[tileCount].slice(0, 5);
            }
            
            localStorage.setItem('rangelandHighScores', JSON.stringify(highScores));
        }
        
        // نمایش مقایسه وضعیت قطعات
        function showTileComparison() {
            const container = document.getElementById('tile-comparison');
            container.innerHTML = '';
            
            tiles.forEach((tile, index) => {
                const initialData = initialTilesData[index];
                const currentData = {
                    vegetation: tile.dataset.vegetation,
                    erosion: tile.dataset.erosion,
                    status: tile.dataset.status,
                    cattle: tile.dataset.cattle,
                    capacity: tile.dataset.capacity
                };
                
                const tileDiv = document.createElement('div');
                tileDiv.className = 'comparison-tile';
                tileDiv.innerHTML = `
                    <h4>قطعه ${index + 1}</h4>
                    <div style="display: flex; justify-content: space-between;">
                        <div>
                            <h5>وضعیت اولیه</h5>
                            <p>پوشش گیاهی: ${initialData.vegetation}%</p>
                            <p>فرسایش خاک: ${initialData.erosion}%</p>
                            <p>وضعیت: ${getTileStatusName(initialData.status)}</p>
                        </div>
                        <div>
                            <h5>وضعیت نهایی</h5>
                            <p>پوشش گیاهی: ${currentData.vegetation}%</p>
                            <p>فرسایش خاک: ${currentData.erosion}%</p>
                            <p>وضعیت: ${getTileStatusName(currentData.status)}</p>
                        </div>
                    </div>
                `;
                
                container.appendChild(tileDiv);
            });
        }
        
        // نمایش نمودارها
        function showCharts() {
            const ctx = document.getElementById('stats-chart').getContext('2d');
            
            // اگر نمودار قبلی وجود دارد، آن را از بین ببریم
            if (window.myChart) {
                window.myChart.destroy();
            }
            
            window.myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: gameHistory.seasons,
                    datasets: [
                        {
                            label: 'پوشش گیاهی (%)',
                            data: gameHistory.vegetation,
                            borderColor: '#6b8e4e',
                            backgroundColor: 'rgba(107, 142, 78, 0.1)',
                            fill: true
                        },
                        {
                            label: 'فرسایش خاک (%)',
                            data: gameHistory.erosion,
                            borderColor: '#a17c5b',
                            backgroundColor: 'rgba(161, 124, 91, 0.1)',
                            fill: true
                        },
                        {
                            label: 'بودجه',
                            data: gameHistory.budget,
                            borderColor: '#5a723f',
                            backgroundColor: 'rgba(90, 114, 63, 0.1)',
                            fill: true
                        },
                        {
                            label: 'امتیاز',
                            data: gameHistory.score,
                            borderColor: '#ff9800',
                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            fill: true
                        },
                        {
                            label: 'رضایت دامداران',
                            data: gameHistory.farmerSatisfaction,
                            borderColor: '#2196F3',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        // نمایش امتیازهای بالا
        function showHighScores() {
            const container = document.getElementById('highscores-list');
            container.innerHTML = '';
            
            if (!highScores[tileCount] || highScores[tileCount].length === 0) {
                container.innerHTML = '<p>هنوز امتیازی برای این تعداد قطعه ثبت نشده است.</p>';
                return;
            }
            
            const list = document.createElement('ul');
            highScores[tileCount].forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>رتبه ${index + 1}:</strong> 
                    امتیاز: ${item.score} | 
                    سطح دشواری: ${getDifficultyName(item.difficulty)} | 
                    تاریخ: ${item.date}
                `;
                list.appendChild(li);
            });
            
            container.appendChild(list);
        }
        
        // ذخیره بازی
        function saveGame() {
            const gameData = {
                budget,
                score,
                season,
                year,
                vegetation,
                erosion,
                tiles: Array.from(tiles).map(tile => ({
                    vegetation: tile.dataset.vegetation,
                    erosion: tile.dataset.erosion,
                    status: tile.dataset.status,
                    cattle: tile.dataset.cattle,
                    capacity: tile.dataset.capacity,
                    soilType: tile.dataset.soilType,
                    topography: tile.dataset.topography,
                    erosionCount: tile.dataset.erosionCount || "0"
                })),
                researchLevel,
                altIncome,
                hasHerbs,
                hasTourism,
                hasBeekeeping,
                hasLivestock,
                hasOtherInvest,
                difficulty,
                tileCount,
                initialTilesData,
                gameHistory,
                farmerSatisfaction,
                lastGrazingSystemYear,
                educationalLinks
            };
            
            localStorage.setItem('rangelandGameSave', JSON.stringify(gameData));
            addEvent("پیشرفت بازی ذخیره شد!");
        }
        
        // بارگذاری بازی
        function loadGame() {
            const savedData = localStorage.getItem('rangelandGameSave');
            if (!savedData) {
                showWarning("هشدار", "هیچ بازی ذخیره شده‌ای یافت نشد!");
                return;
            }
            
            const gameData = JSON.parse(savedData);
            
            // بارگذاری متغیرهای اصلی
            budget = gameData.budget;
            score = gameData.score;
            season = gameData.season;
            year = gameData.year;
            vegetation = gameData.vegetation;
            erosion = gameData.erosion;
            researchLevel = gameData.researchLevel;
            altIncome = gameData.altIncome;
            hasHerbs = gameData.hasHerbs;
            hasTourism = gameData.hasTourism;
            hasBeekeeping = gameData.hasBeekeeping;
            hasLivestock = gameData.hasLivestock;
            hasOtherInvest = gameData.hasOtherInvest;
            difficulty = gameData.difficulty;
            tileCount = gameData.tileCount;
            initialTilesData = gameData.initialTilesData;
            gameHistory = gameData.gameHistory;
            farmerSatisfaction = gameData.farmerSatisfaction || 50;
            lastGrazingSystemYear = gameData.lastGrazingSystemYear || 0;
            educationalLinks = gameData.educationalLinks || [
                { title: "مثال واقعی از مدیریت مراتع در ایران", url: "https://example.com/rangeland1" },
                { title: "راهکارهای احیای مراتع تخریب شده", url: "https://example.com/rangeland2" },
                { title: "تأثیر تغییرات اقلیمی بر مراتع", url: "https://example.com/rangeland3" }
            ];
            
            // تنظیم سطح دشواری
            document.getElementById(`${difficulty}-btn`).classList.add('active');
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                if (btn.id !== `${difficulty}-btn`) {
                    btn.classList.remove('active');
                }
            });
            
            // تنظیم تعداد قطعات
            document.getElementById('tile-count').value = tileCount;
            document.getElementById('tile-count-value').textContent = tileCount;
            
            if (tileCount <= 9) {
                gridRows = 3;
                gridCols = Math.ceil(tileCount / 3);
            } else {
                gridRows = Math.ceil(tileCount / 4);
                gridCols = 4;
            }
            
            // بارگذاری قطعات
            const map = document.getElementById('range-map');
            map.innerHTML = '';
            tiles = [];
            
            map.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
            map.style.gridTemplateRows = `repeat(${gridRows}, 1fr)`;
            
            gameData.tiles.forEach((tileData, i) => {
                const tile = document.createElement('div');
                tile.className = 'tile';
                
                tile.dataset.vegetation = tileData.vegetation;
                tile.dataset.erosion = tileData.erosion;
                tile.dataset.status = tileData.status;
                tile.dataset.cattle = tileData.cattle;
                tile.dataset.capacity = tileData.capacity;
                tile.dataset.soilType = tileData.soilType;
                tile.dataset.topography = tileData.topography;
                tile.dataset.erosionCount = tileData.erosionCount || "0";
                
                tile.classList.add(tileData.status);
                
                tile.textContent = (i + 1).toString();
                
                tile.addEventListener('click', function() {
                    selectTile(tile, i + 1);
                });
                
                map.appendChild(tile);
                tiles.push(tile);
                updateTileDisplay(tile);
            });
            
            // به‌روزرسانی نمایش
            updateDisplay();
            updateFarmerSatisfaction();
            startTimer();
            
            addEvent("بازی با موفقیت بارگذاری شد!");
        }
        
        // تبدیل وضعیت قطعه به متن فارسی
        function getTileStatusName(status) {
            switch(status) {
                case 'critical':
                    return 'بحرانی';
                case 'degraded':
                    return 'تخریب شده';
                case 'recovering':
                    return 'در حال بهبود';
                case 'healthy':
                    return 'سالم';
                default:
                    return '';
            }
        }
        
        // تبدیل نام اقدام به متن فارسی
        function getActionName(action) {
            switch(action) {
                case 'contour':
                    return 'کنتورفارو';
                case 'seeding':
                    return 'بذرپاشی';
                case 'hill':
                    return 'کپه کاری';
                case 'sapling':
                    return 'نهالکاری';
                case 'water':
                    return 'آبیاری تکمیلی';
                case 'fence':
                    return 'تامین علوفه جایگزین و محدود کردن چرا';
                case 'grazing-system':
                    return 'استفاده از سیستم چرای دام متناسب با منطقه';
                default:
                    return '';
            }
        }
        
        // تبدیل سطح دشواری به متن فارسی
        function getDifficultyName(difficulty) {
            switch(difficulty) {
                case 'easy':
                    return 'آسان (مبتدی)';
                case 'medium':
                    return 'متوسط (کارشناس)';
                case 'hard':
                    return 'سخت (پیشرفته)';
                default:
                    return '';
            }
        }

        // رویدادهای دکمه‌ها
        document.addEventListener('DOMContentLoaded', function() {
            // رویدادهای دکمه‌ها
            document.getElementById('contour-btn').addEventListener('click', function() {
                performAction('contour');
            });
            
            document.getElementById('seeding-btn').addEventListener('click', function() {
                performAction('seeding');
            });
            
            document.getElementById('hill-btn').addEventListener('click', function() {
                performAction('hill');
            });
            
            document.getElementById('sapling-btn').addEventListener('click', function() {
                performAction('sapling');
            });
            
            document.getElementById('water-btn').addEventListener('click', function() {
                performAction('water');
            });
            
            document.getElementById('fence-btn').addEventListener('click', function() {
                performAction('fence');
            });
            
            document.getElementById('grazing-system-btn').addEventListener('click', function() {
                performAction('grazing-system');
            });
            
            document.getElementById('research-btn').addEventListener('click', function() {
                performAction('research');
            });
            
            document.getElementById('next-season-btn').addEventListener('click', function() {
                nextSeason();
            });
            
            document.getElementById('herbs-btn').addEventListener('click', function() {
                startAlternativeIncome('herbs', 700, 50);
            });
            
            document.getElementById('tourism-btn').addEventListener('click', function() {
                startAlternativeIncome('tourism', 900, 80);
            });
            
            document.getElementById('beekeeping-btn').addEventListener('click', function() {
                startAlternativeIncome('beekeeping', 500, 60);
            });
            
            document.getElementById('livestock-btn').addEventListener('click', function() {
                startAlternativeIncome('livestock', 50, 10);
            });
            
            document.getElementById('other-invest-btn').addEventListener('click', function() {
                startAlternativeIncome('other-invest', 700, 50);
            });
            
            document.getElementById('event-close').addEventListener('click', function() {
                document.getElementById('event-popup').style.display = 'none';
                document.getElementById('overlay').style.display = 'none';
            });
            
            document.getElementById('warning-close').addEventListener('click', function() {
                document.getElementById('warning-popup').style.display = 'none';
                document.getElementById('overlay').style.display = 'none';
            });
            
            document.getElementById('end-game-close').addEventListener('click', function() {
                document.getElementById('end-game-popup').style.display = 'none';
                document.getElementById('overlay').style.display = 'none';
            });
            
            document.getElementById('save-game-btn').addEventListener('click', function() {
                saveGame();
            });
            
            document.getElementById('load-game-btn').addEventListener('click', function() {
                loadGame();
            });
            
            document.getElementById('generate-pdf-btn').addEventListener('click', function() {
                generatePDF();
            });
            
            document.getElementById('decision-report-btn').addEventListener('click', function() {
                generateDecisionReport();
            });
            
            document.getElementById('compare-students-btn').addEventListener('click', function() {
                showStudentComparison();
            });
            
            // انتخاب سطح دشواری
            document.getElementById('easy-btn').addEventListener('click', function() {
                difficulty = 'easy';
                document.getElementById('easy-btn').classList.add('active');
                document.getElementById('medium-btn').classList.remove('active');
                document.getElementById('hard-btn').classList.remove('active');
            });
            
            document.getElementById('medium-btn').addEventListener('click', function() {
                difficulty = 'medium';
                document.getElementById('easy-btn').classList.remove('active');
                document.getElementById('medium-btn').classList.add('active');
                document.getElementById('hard-btn').classList.remove('active');
            });
            
            document.getElementById('hard-btn').addEventListener('click', function() {
                difficulty = 'hard';
                document.getElementById('easy-btn').classList.remove('active');
                document.getElementById('medium-btn').classList.remove('active');
                document.getElementById('hard-btn').classList.add('active');
            });
            
            // تنظیم تعداد قطعات با اسلایدر
            document.getElementById('tile-count').addEventListener('input', function() {
                tileCount = parseInt(this.value);
                document.getElementById('tile-count-value').textContent = tileCount;
                
                if (tileCount <= 9) {
                    gridRows = 3;
                    gridCols = Math.ceil(tileCount / 3);
                } else {
                    gridRows = Math.ceil(tileCount / 4);
                    gridCols = 4;
                }
            });
            
            // تب‌های نتایج
            document.querySelectorAll('.results-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    document.querySelectorAll('.results-tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.results-content').forEach(c => c.classList.remove('active'));
                    
                    this.classList.add('active');
                    const tabId = this.getAttribute('data-tab');
                    document.getElementById(`${tabId}-content`).classList.add('active');
                });
            });
            
            // دکمه شروع بازی
            document.getElementById('start-game-btn').addEventListener('click', function() {
                startGame();
            });
        });
        
        // شروع بازی
        function startGame() {
            // دریافت اطلاعات دانشجو
            studentName = document.getElementById('student-name').value.trim();
            studentId = document.getElementById('student-id').value.trim();
            const accessCode = document.getElementById('access-code').value.trim();
            
            // بررسی پر بودن فیلدها
            if (!studentName || !studentId || !accessCode) {
                alert('لطفاً تمام فیلدها را پر کنید!');
                return;
            }
            
            // بررسی طول کد
            if (accessCode.length !== 8) {
                alert('کد دسترسی باید 8 رقم باشد!');
                return;
            }
            
            // اعتبارسنجی کد
            const validation = validateOTP(accessCode, difficulty);
            if (!validation.valid) {
                alert(validation.message);
                return;
            }
            
            // علامت‌گذاری کد به عنوان استفاده شده
            markCodeAsUsed(accessCode, difficulty);
            
            // ذخیره تنظیمات بازی برای گزارش
            window.gameSettings = {
                difficulty: difficulty,
                tileCount: tileCount,
                difficultyText: difficulty === 'easy' ? 'آسان (مبتدی)' : 
                               difficulty === 'medium' ? 'متوسط (کارشناس)' : 
                               'سخت (پیشرفته)'
            };
            
            document.getElementById('config-panel').style.display = 'none';
            document.getElementById('game-content').style.display = 'block';
            initializeGame();
            updateDisplay();
            startTimer();
        }
    