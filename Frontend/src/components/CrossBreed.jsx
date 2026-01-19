import React, { useState } from "react";
import "./CrossBreed.css";
import CrossBreedTool from "./CrossBreedTool";

const CrossBreed = () => {
  const [language, setLanguage] = useState("english");
  const [activeTab, setActiveTab] = useState("benefits");
  const [activeTabUrdu, setActiveTabUrdu] = useState("benefits-ur");
  const [showTool, setShowTool] = useState(false);

  return (
    <div className="cross-breed-container">
      <h1>Plant Cross Breeding</h1>
      <p>
        Explore plant cross breeding possibilities and create new hybrid
        varieties.
      </p>

      <div className="cross-breed-content">
        <div className="top-controls">
          <div className="navigation-buttons">
            <button
              className={`nav-button ${!showTool ? "active" : ""}`}
              onClick={() => setShowTool(false)}
            >
              Info
            </button>

            <button
              className={`nav-button ${showTool ? "active" : ""}`}
              onClick={() => setShowTool(true)}
            >
              Cross Breed Tool
            </button>
          </div>

          <div className="language-toggle">
            <button
              className={`lang-button ${
                language === "english" ? "active" : ""
              }`}
              onClick={() => setLanguage("english")}
            >
              English
            </button>

            <button
              className={`lang-button ${language === "urdu" ? "active" : ""}`}
              onClick={() => setLanguage("urdu")}
            >
              اردو
            </button>
          </div>
        </div>

        {showTool ? (
          <CrossBreedTool />
        ) : (
          <div className="cross-breed-info">
            {language === "english" ? (
              <div className="info-content" lang="en" dir="ltr">
                <h2 className="theme-secondary">About Plant Hybridization</h2>

                <div className="info-highlight">
                  <p>
                    Plant hybridization is the process of crossing two
                    genetically different plants to create a new variety with
                    desirable traits from both parents.
                  </p>
                </div>

                <div className="content-tabs">
                  <div className="tab-container">
                    <div
                      className={`tab ${
                        activeTab === "benefits" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("benefits")}
                    >
                      Benefits
                    </div>

                    <div
                      className={`tab ${activeTab === "steps" ? "active" : ""}`}
                      onClick={() => setActiveTab("steps")}
                    >
                      Steps
                    </div>

                    <div
                      className={`tab ${activeTab === "myths" ? "active" : ""}`}
                      onClick={() => setActiveTab("myths")}
                    >
                      Myths
                    </div>

                    <div
                      className={`tab ${activeTab === "tips" ? "active" : ""}`}
                      onClick={() => setActiveTab("tips")}
                    >
                      Tips
                    </div>
                  </div>

                  <div
                    className={`tab-content ${
                      activeTab === "benefits" ? "active" : ""
                    }`}
                    id="benefits"
                  >
                    <h3 className="tab-section-title">
                      Benefits of Plant Cross-Breeding
                    </h3>

                    <div className="benefit-cards">
                      <div className="benefit-card">
                        <h4>Higher Crop Yield</h4>
                        <p>
                          Cross-breeding creates plants with increased
                          productivity and vigor, helping farmers harvest more
                          food from the same land area while maintaining
                          quality.
                        </p>
                        <p className="card-detail">
                          By selecting parent plants with naturally high
                          productivity and combining their traits, new varieties
                          can produce up to 30% more yield.
                        </p>
                      </div>

                      <div className="benefit-card">
                        <h4>Disease Resistance</h4>
                        <p>
                          Hybrid plants can be developed with improved immunity
                          to common pests, fungi, bacteria and viruses that
                          typically damage crops and reduce harvests.
                        </p>
                        <p className="card-detail">
                          This reduces the need for chemical pesticides and
                          helps ensure consistent harvests even during disease
                          outbreaks in your region.
                        </p>
                      </div>

                      <div className="benefit-card">
                        <h4>Climate Adaptability</h4>
                        <p>
                          New varieties can thrive in changing environmental
                          conditions such as drought, flooding, temperature
                          extremes, or poor soil quality in different regions.
                        </p>
                        <p className="card-detail">
                          Some hybrids require 40% less water while maintaining
                          good productivity, making them ideal for water-scarce
                          regions and sustainable farming.
                        </p>
                      </div>

                      <div className="benefit-card">
                        <h4>Improved Nutrition</h4>
                        <p>
                          Cross-breeding can enhance the vitamin, mineral and
                          protein content of food crops for better human
                          nutrition and overall health benefits globally.
                        </p>
                        <p className="card-detail">
                          Golden Rice, created through cross-breeding, contains
                          beta-carotene which helps prevent vitamin A deficiency
                          in developing countries worldwide.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`tab-content ${
                      activeTab === "steps" ? "active" : ""
                    }`}
                    id="steps"
                  >
                    <h3 className="tab-section-title">
                      How to Cross-Breed Plants
                    </h3>

                    <div className="step-cards">
                      <div className="step-card">
                        <h4>1. Identify Compatible Plants</h4>
                        <p>
                          Research plants within the same family or genus that
                          are genetically compatible for successful
                          hybridization and breeding.
                        </p>
                        <p className="card-detail">
                          Look for plants that flower at the same time of year
                          and have similar reproductive structures. Not all
                          plants, even within the same genus, can successfully
                          cross-pollinate.
                        </p>
                      </div>

                      <div className="step-card">
                        <h4>2. Select Female Flower</h4>
                        <p>
                          Choose a healthy female flower that hasn't been
                          pollinated yet to serve as the seed parent for your
                          hybrid plant.
                        </p>
                        <p className="card-detail">
                          Select a flower just before it opens naturally. Remove
                          any anthers (male parts) from the female flower to
                          prevent self-pollination, a process called
                          emasculation.
                        </p>
                      </div>

                      <div className="step-card">
                        <h4>3. Collect Pollen</h4>
                        <p>
                          Gather fresh pollen from the selected male parent
                          plant during peak pollen production time for best
                          results.
                        </p>
                        <p className="card-detail">
                          Use a small, soft brush or cotton swab to carefully
                          collect pollen from the anthers. Store in a paper
                          envelope if not using immediately. Morning collection
                          often yields the best results.
                        </p>
                      </div>

                      <div className="step-card">
                        <h4>4. Transfer Pollen</h4>
                        <p>
                          Carefully apply the collected pollen to the stigma of
                          the female flower to complete the pollination process
                          successfully.
                        </p>
                        <p className="card-detail">
                          After pollination, cover the flower with a paper or
                          mesh bag to prevent contamination from other pollen
                          sources. Label it with the parent plants' names and
                          pollination date.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`tab-content ${
                      activeTab === "myths" ? "active" : ""
                    }`}
                    id="myths"
                  >
                    <h3 className="tab-section-title">
                      Common Myths About Cross-Breeding
                    </h3>

                    <div className="myth-cards">
                      <div className="myth-card">
                        <h4>Any Plants Can Be Crossed</h4>
                        <p>
                          Many believe you can cross any two plants together,
                          but this is false. Plants must be closely related
                          genetically.
                        </p>
                        <p className="card-detail">
                          Reality: Only plants within the same genus or closely
                          related species can successfully cross-breed. You
                          cannot cross a tomato with a cucumber, for example.
                        </p>
                      </div>

                      <div className="myth-card">
                        <h4>GMOs and Hybrids Are Same</h4>
                        <p>
                          Cross-breeding and genetic modification are often
                          confused, but they are completely different processes
                          and techniques.
                        </p>
                        <p className="card-detail">
                          Reality: Cross-breeding uses natural pollination
                          between compatible plants, while GMOs involve
                          laboratory gene insertion from unrelated organisms.
                        </p>
                      </div>

                      <div className="myth-card">
                        <h4>Hybrid Seeds Are Always Sterile</h4>
                        <p>
                          A common misconception is that all hybrid plants
                          produce sterile seeds that cannot be replanted for
                          crops.
                        </p>
                        <p className="card-detail">
                          Reality: Most hybrids produce fertile seeds, but
                          offspring may not have the same traits as parents.
                          Only specific hybrids like seedless watermelons are
                          sterile.
                        </p>
                      </div>

                      <div className="myth-card">
                        <h4>Cross-Breeding Is Unnatural</h4>
                        <p>
                          Some believe cross-breeding is an artificial process
                          that doesn't occur in nature without human
                          intervention.
                        </p>
                        <p className="card-detail">
                          Reality: Cross-pollination happens naturally in the
                          wild through wind, insects, and animals. Humans simply
                          guide this natural process for desired outcomes.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`tab-content ${
                      activeTab === "tips" ? "active" : ""
                    }`}
                    id="tips"
                  >
                    <h3 className="tab-section-title">
                      Important Tips & Considerations
                    </h3>

                    <div className="myth-cards">
                      <div className="myth-card">
                        <h4>Genetic Compatibility</h4>
                        <p>
                          Cross-breeding is most successful between plants of
                          the same species or closely related species within a
                          genus.
                        </p>
                        <p className="card-detail">
                          Even when plants appear similar, genetic differences
                          can prevent successful hybridization. Start with
                          plants known to be compatible based on scientific
                          literature or gardening resources.
                        </p>
                      </div>

                      <div className="myth-card">
                        <h4>Timing Is Critical</h4>
                        <p>
                          Pollination must be done when both the female stigma
                          is receptive and the male pollen is viable.
                        </p>
                        <p className="card-detail">
                          For most plants, the stigma is most receptive in the
                          morning hours. Multiple pollination attempts over
                          several days can increase success rates substantially.
                        </p>
                      </div>

                      <div className="myth-card">
                        <h4>Environmental Factors</h4>
                        <p>
                          Temperature, humidity, and light levels all affect
                          hybridization success rates significantly.
                        </p>
                        <p className="card-detail">
                          Moderate temperatures (65-75°F/18-24°C) and humidity
                          levels between 50-70% typically provide optimal
                          conditions for successful pollination in most plant
                          species.
                        </p>
                      </div>

                      <div className="myth-card">
                        <h4>Record Keeping</h4>
                        <p>
                          Maintain detailed records of parent plants,
                          pollination dates, and environmental conditions for
                          future reference.
                        </p>
                        <p className="card-detail">
                          Document each cross with photos, dates, parent plant
                          characteristics, and outcomes. This data helps
                          identify successful combinations and improve future
                          breeding efforts.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="info-content" lang="ur" dir="rtl">
                <h2 className="theme-secondary">
                  پودوں کی تخلیقی افزائش کے بارے میں
                </h2>

                <div className="info-highlight">
                  <p>
                    پودوں کی تخلیقی افزائش وہ عمل ہے جس میں دو مختلف جینیاتی
                    پودوں کو آپس میں ملا کر ایک نئی قسم بنائی جاتی ہے جس میں
                    دونوں والدین کی پسندیدہ خصوصیات ہوتی ہیں۔
                  </p>
                </div>

                <div className="content-tabs">
                  <div className="tab-container">
                    <div
                      className={`tab ${
                        activeTabUrdu === "benefits-ur" ? "active" : ""
                      }`}
                      onClick={() => setActiveTabUrdu("benefits-ur")}
                    >
                      فوائد
                    </div>

                    <div
                      className={`tab ${
                        activeTabUrdu === "steps-ur" ? "active" : ""
                      }`}
                      onClick={() => setActiveTabUrdu("steps-ur")}
                    >
                      طریقہ کار
                    </div>

                    <div
                      className={`tab ${
                        activeTabUrdu === "myths-ur" ? "active" : ""
                      }`}
                      onClick={() => setActiveTabUrdu("myths-ur")}
                    >
                      غلط فہمیاں
                    </div>

                    <div
                      className={`tab ${
                        activeTabUrdu === "tips-ur" ? "active" : ""
                      }`}
                      onClick={() => setActiveTabUrdu("tips-ur")}
                    >
                      تجاویز
                    </div>
                  </div>

                  <div
                    className={`tab-content ${
                      activeTabUrdu === "benefits-ur" ? "active" : ""
                    }`}
                    id="benefits-ur"
                  >
                    <h3 className="tab-section-title">
                      تخلیقی افزائش کے فوائد
                    </h3>

                    <div className="benefit-cards">
                      <div className="benefit-card">
                        <h4>فصل کی پیداوار میں اضافہ</h4>
                        <p>
                          تخلیقی افزائش ایسے پودے تیار کرتی ہے جن کی پیداواری
                          صلاحیت اور طاقت زیادہ ہوتی ہے، جس سے کسانوں کو اسی
                          زمین سے زیادہ معیاری خوراک حاصل کرنے میں مدد ملتی ہے。
                        </p>
                        <p className="card-detail">
                          فطری طور پر زیادہ پیداوار دینے والے والدین پودوں کا
                          انتخاب کرکے، نئی اقسام 30% تک زیادہ پیداوار دے سکتی
                          ہیں。
                        </p>
                      </div>

                      <div className="benefit-card">
                        <h4>بیماریوں سے مزاحمت</h4>
                        <p>
                          ہائبرڈ پودوں کو عام کیڑے، فنگس، بیکٹیریا اور وائرس کے
                          خلاف بہتر مدافعت کے ساتھ تیار کیا جا سکتا ہے جو عام
                          طور پر فصلوں کو نقصان پہنچاتے ہیں اور کٹائی کم کرتے
                          ہیں。
                        </p>
                        <p className="card-detail">
                          اس سے کیمیائی کیڑے مار ادویات کی ضرورت کم ہوتی ہے اور
                          آپ کے علاقے میں بیماری پھیلنے کے دوران بھی مستقل فصل
                          کی یقین دہانی ہوتی ہے。
                        </p>
                      </div>

                      <div className="benefit-card">
                        <h4>موسمیاتی موافقت</h4>
                        <p>
                          نئی اقسام خشک سالی، سیلاب، درجہ حرارت کی انتہا، یا
                          مختلف علاقوں میں خراب مٹی کے معیار جیسے بدلتے
                          ماحولیاتی حالات میں بھی پھل پھول سکتی ہیں。
                        </p>
                        <p className="card-detail">
                          کچھ ہائبرڈ پودے اچھی پیداوری برقرار رکھتے ہوئے 40% کم
                          پانی کا استعمال کرتے ہیں، جو انہیں پانی کی کمی والے
                          علاقوں اور پائیدار کاشتکاری کے لیے مثالی بناتا ہے。
                        </p>
                      </div>

                      <div className="benefit-card">
                        <h4>غذائی اجزاء میں بہتری</h4>
                        <p>
                          تخلیقی افزائش سے خوراک کی فصلوں کے وٹامن، منرل اور
                          پروٹین مواد کو بہتر انسانی غذائیت اور مجموعی صحت کے
                          فوائد کے لیے عالمی سطح پر بڑھایا جا سکتا ہے。
                        </p>
                        <p className="card-detail">
                          گولڈن رائس، جو تخلیقی افزائش کے ذریعے تیار کیا گیا ہے،
                          بیٹا کیروٹین پر مشتمل ہے جو دنیا بھر میں ترقی پذیر
                          ممالک میں وٹامن اے کی کمی کو روکنے میں مدد کرتا ہے。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`tab-content ${
                      activeTabUrdu === "steps-ur" ? "active" : ""
                    }`}
                    id="steps-ur"
                  >
                    <h3 className="tab-section-title">
                      پودوں کی تخلیقی افزائش کا طریقہ
                    </h3>

                    <div className="step-cards">
                      <div className="step-card">
                        <h4>١. موزوں پودوں کی شناخت</h4>
                        <p>
                          ایسے پودوں کی تحقیق کریں جو ایک ہی خاندان یا جنس سے
                          تعلق رکھتے ہوں اور جینیاتی طور پر ہائبریڈائزیشن اور
                          افزائش کے لیے ہم آہنگ ہوں。
                        </p>
                        <p className="card-detail">
                          ایسے پودوں کو تلاش کریں جو سال کے ایک ہی وقت میں پھول
                          لائیں اور ان کی نسل پیدا کرنے والی ساخت ایک جیسی ہو。
                        </p>
                      </div>

                      <div className="step-card">
                        <h4>٢. خواتین پھول کا انتخاب</h4>
                        <p>
                          بیج والدین کے طور پر ایک صحت مند خواتین پھول منتخب
                          کریں جس میں ابھی تک گرد افشانی نہ ہوئی ہو اور جو آپ کے
                          ہائبرڈ پودے کے لیے موزوں ہو。
                        </p>
                        <p className="card-detail">
                          پھول کو اس سے پہلے منتخب کریں کہ وہ قدرتی طور پر کھل
                          جائے۔ خود گرد افشانی کو روکنے کے لیے خواتین پھول سے
                          مردانہ حصے کو ہٹا دیں۔
                        </p>
                      </div>

                      <div className="step-card">
                        <h4>٣. پولن جمع کریں</h4>
                        <p>
                          منتخب کردہ مرد والدین پودے سے بہترین نتائج کے لیے
                          زیادہ سے زیادہ پولن پیداوار کے وقت تازہ پولن جمع
                          کریں。
                        </p>
                        <p className="card-detail">
                          پولن کو احتیاط سے جمع کرنے کے لیے ایک چھوٹے، نرم برش
                          یا کاٹن سویب کا استعمال کریں۔ اگر فوری استعمال نہیں کر
                          رہے ہیں تو ذخیرہ کریں۔
                        </p>
                      </div>

                      <div className="step-card">
                        <h4>٤. پولن کی منتقلی</h4>
                        <p>
                          جمع کردہ پولن کو احتیاط سے خواتین پھول کے سٹگما پر
                          لگائیں تاکہ گرد افشانی کا عمل کامیابی سے مکمل ہو سکے。
                        </p>
                        <p className="card-detail">
                          گرد افشانی کے بعد، پھول کو دوسرے پولن ذرائع سے آلودگی
                          سے بچانے کے لیے کاغذ یا میش بیگ سے ڈھانپ دیں。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`tab-content ${
                      activeTabUrdu === "myths-ur" ? "active" : ""
                    }`}
                    id="myths-ur"
                  >
                    <h3 className="tab-section-title">
                      تخلیقی افزائش کے بارے میں عام غلط فہمیاں
                    </h3>

                    <div className="myth-cards">
                      <div className="myth-card">
                        <h4>کوئی بھی پودے آپس میں ملائے جا سکتے ہیں</h4>
                        <p>
                          بہت سے لوگ سمجھتے ہیں کہ آپ کسی بھی دو پودوں کو آپس
                          میں ملا سکتے ہیں، لیکن یہ غلط ہے۔ پودوں کا جینیاتی طور
                          پر قریب ہونا ضروری ہے。
                        </p>
                        <p className="card-detail">
                          حقیقت: صرف ایک ہی جنس یا قریبی متعلقہ انواع کے پودے
                          کامیابی سے کراس بریڈ ہو سکتے ہیں۔ مثال کے طور پر، آپ
                          ٹماٹر کو کھیرے کے ساتھ کراس نہیں کر سکتے。
                        </p>
                      </div>

                      <div className="myth-card">
                        <h4>جی ایم او اور ہائبرڈ ایک ہی ہیں</h4>
                        <p>
                          کراس بریڈنگ اور جینیاتی تبدیلی کو اکثر آپس میں ملا دیا
                          جاتا ہے، لیکن یہ بالکل مختلف عمل اور تکنیک ہیں。
                        </p>
                        <p className="card-detail">
                          حقیقت: کراس بریڈنگ موزوں پودوں کے درمیان قدرتی گرد
                          افشانی استعمال کرتی ہے، جبکہ جی ایم او میں غیر متعلقہ
                          جانداروں سے جینوں کی لیبارٹری داخلہ شامل ہے。
                        </p>
                      </div>

                      <div className="myth-card">
                        <h4>ہائبرڈ بیج ہمیشہ بانجھ ہوتے ہیں</h4>
                        <p>
                          ایک عام غلط فہمی یہ ہے کہ تمام ہائبرڈ پودے بانجھ بیج
                          پیدا کرتے ہیں جنہیں فصلوں کے لیے دوبارہ نہیں لگایا جا
                          سکتا。
                        </p>
                        <p className="card-detail">
                          حقیقت: زیادہ تر ہائبرڈ زرخیز بیج پیدا کرتے ہیں، لیکن
                          اولاد میں والدین جیسی خصوصیات نہیں ہو سکتیں۔ صرف مخصوص
                          ہائبرڈ جیسے بے بیج تربوز بانجھ ہوتے ہیں。
                        </p>
                      </div>

                      <div className="myth-card">
                        <h4>کراس بریڈنگ غیر قدرتی ہے</h4>
                        <p>
                          کچھ لوگ سمجھتے ہیں کہ کراس بریڈنگ ایک مصنوعی عمل ہے جو
                          انسانی مداخلت کے بغیر فطرت میں نہیں ہوتا。
                        </p>
                        <p className="card-detail">
                          حقیقت: کراس پولینیشن قدرتی طور پر جنگلی میں ہوا، کیڑوں
                          اور جانوروں کے ذریعے ہوتی ہے۔ انسان صرف اس قدرتی عمل
                          کو مطلوبہ نتائج کے لیے رہنمائی کرتے ہیں。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`tab-content ${
                      activeTabUrdu === "tips-ur" ? "active" : ""
                    }`}
                    id="tips-ur"
                  >
                    <h3 className="tab-section-title">
                      اہم تجاویز اور ملاحظات
                    </h3>

                    <div className="myth-cards">
                      <div className="myth-card">
                        <h4>جینیاتی مطابقت</h4>
                        <p>
                          تخلیقی افزائش اسی نوع کے پودوں یا ایک ہی جنس کے اندر
                          قریبی متعلقہ انواع کے درمیان سب سے زیادہ کامیاب ہوتی
                          ہے۔
                        </p>
                        <p className="card-detail">
                          یہاں تک کہ جب پودے ایک جیسے نظر آتے ہیں، جینیاتی
                          اختلافات کامیاب ہائبریڈائزیشن کو روک سکتے ہیں۔ سائنسی
                          ادب یا باغبانی کے وسائل کی بنیاد پر معلوم ہم آہنگ
                          پودوں سے شروع کریں۔
                        </p>
                      </div>

                      <div className="myth-card">
                        <h4>وقت اہم ہے</h4>
                        <p>
                          گرد افشانی اس وقت کی جانی چاہیے جب خواتین سٹگما قابل
                          قبول ہو اور مرد پولن قابل عمل ہو。
                        </p>
                        <p className="card-detail">
                          زیادہ تر پودوں کے لیے، سٹگما صبح کے اوقات میں سب سے
                          زیادہ قبول کرنے والا ہوتا ہے۔ کئی دنوں میں متعدد گرد
                          افشانی کی کوششیں کامیابی کی شرح کو نمایاں طور پر بڑھا
                          سکتی ہیں۔
                        </p>
                      </div>

                      <div className="myth-card">
                        <h4>ماحولیاتی عوامل</h4>
                        <p>
                          درجہ حرارت، نمی، اور روشنی کی سطح سب ہائبریڈائزیشن کی
                          کامیابی کی شرح کو نمایاں طور پر متاثر کرتی ہے。
                        </p>
                        <p className="card-detail">
                          معتدل درجہ حرارت (18-24°C) اور 50-70% کے درمیان نمی کی
                          سطح عام طور پر زیادہ تر پودوں کی انواع میں کامیاب گرد
                          افشانی کے لیے مثالی حالات فراہم کرتی ہے۔
                        </p>
                      </div>

                      <div className="myth-card">
                        <h4>ریکارڈ رکھنا</h4>
                        <p>
                          مستقبل کے حوالے کے لیے والدین پودوں، گرد افشانی کی
                          تاریخوں اور ماحولیاتی حالات کے تفصیلی ریکارڈ برقرار
                          رکھیں。
                        </p>
                        <p className="card-detail">
                          ہر کراس کو تصاویر، تاریخوں، والدین پودوں کی خصوصیات
                          اور نتائج کے ساتھ دستاویز کریں۔ یہ ڈیٹا کامیاب مجموعوں
                          کی شناخت اور مستقبل کی افزائش کی کوششوں کو بہتر بنانے
                          میں مدد کرتا ہے。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrossBreed;
