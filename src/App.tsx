import React, { useState, useMemo, useRef } from 'react';
import data from './data.json';
import { FormRenderer } from './FormRenderer';
import './App.css';

interface FlowStep {
  step: string;
  desc: string;
  linkId?: string;
}

interface FormItem {
  title: string;
  page: number;
}

interface GuideItem {
  id: string;
  title: string;
  keywords: string[];
  visualType: string;
  visualData: FlowStep[];
  originalText: string;
  forms?: FormItem[];
}

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [originalTextExpandedIds, setOriginalTextExpandedIds] = useState<string[]>([]);
  const [formExpandedIds, setFormExpandedIds] = useState<string[]>([]);
  const [showOriginalFlowchart, setShowOriginalFlowchart] = useState(false);
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const lowerTerm = searchTerm.toLowerCase();
    return data.filter((item: GuideItem) => 
      item.title.toLowerCase().includes(lowerTerm) || 
      item.keywords.some(kw => kw.toLowerCase().includes(lowerTerm))
    );
  }, [searchTerm]);

  const scrollToSection = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedId(id);
    setTimeout(() => {
      scrollRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const toggleOriginalText = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOriginalTextExpandedIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleForms = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormExpandedIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  return (
    <div className="container">
      <header>
        <h1>학교폭력 사안처리 가이드북</h1>
        <p>실무 핵심 키워드 스마트 검색 시스템 (2026 일부개정)</p>
      </header>

      {/* Action Map */}
      <section className="rich-process-map">
        <h3>학교폭력 사안처리 흐름도 (Action Map)</h3>
        <div className="map-grid">
          <div className="map-column school">
            <div className="column-label">학교</div>
            <div className="map-node" onClick={() => scrollToSection("1")}>사안 인지 및 접수</div>
            <div className="map-node highlight" onClick={() => scrollToSection("2")}>가해·피해학생 분리</div>
            <div className="map-node" onClick={() => scrollToSection("3")}>교육청 보고 (48h)</div>
          </div>
          <div className="map-arrow-large">▶</div>
          <div className="map-column committee">
            <div className="column-label">전담기구</div>
            <div className="map-node" onClick={() => scrollToSection("0")}>사안 조사 및 확인</div>
            <div className="map-node branch">
              <div className="branch-yes" onClick={() => scrollToSection("4")}>자체해결</div>
              <div className="branch-no" onClick={() => scrollToSection("3")}>심의요청</div>
            </div>
          </div>
          <div className="map-arrow-large">▶</div>
          <div className="map-column office">
            <div className="column-label">교육지원청 (심의위)</div>
            <div className="map-node" onClick={() => scrollToSection("5")}>조치 결정 및 통보</div>
            <div className="map-node secondary" onClick={() => scrollToSection("7")}>불복 절차 (행심/소송)</div>
          </div>
          <div className="map-arrow-large">▶</div>
          <div className="map-column finish">
            <div className="column-label">사후 조치</div>
            <div className="map-node" onClick={() => scrollToSection("6")}>생기부 기재/관리</div>
            <div className="map-node">관계회복 지원</div>
          </div>
        </div>
        <p className="map-tip">* 각 단계를 클릭하면 상세 설명으로 바로 이동합니다.</p>
        
        <div className="original-map-toggle">
          <button 
            className="text-toggle-btn form-btn" 
            onClick={() => setShowOriginalFlowchart(!showOriginalFlowchart)}
          >
            {showOriginalFlowchart ? '원본 흐름도 숨기기' : '가이드북 원본 흐름도 보기'}
          </button>
        </div>

        {showOriginalFlowchart && (
          <div className="original-map-container animate-in">
            <img 
              src="/forms/flowchart-origin.png" 
              alt="학교폭력 사안처리 흐름도 원본" 
              className="form-image"
            />
          </div>
        )}
      </section>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="검색어를 입력하세요 (예: 전담기구, 분리, 조치사항)" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn">검색</button>
      </div>

      <div className="result-list">
        {filteredData.map((item: GuideItem) => (
          <div 
            key={item.id} 
            ref={el => scrollRefs.current[item.id] = el}
            className={`result-card ${expandedId === item.id ? 'active' : ''}`}
          >
            <div className="card-header" onClick={() => toggleExpand(item.id)}>
              <div className="header-main">
                <h2>{item.title}</h2>
                <div className="keyword-tags">
                  {item.keywords.map((kw, i) => (
                    <span key={i} className="tag">#{kw}</span>
                  ))}
                </div>
              </div>
              <div className="expand-icon">
                {expandedId === item.id ? '▲ 접기' : '▼ 상세보기'}
              </div>
            </div>
            
            {expandedId === item.id && (
              <div className="card-content animate-in">
                <div className="diagram-container">
                  <div className="flowchart">
                    {item.visualData.map((flow, index) => (
                      <React.Fragment key={index}>
                        <div 
                          className={`flow-step ${flow.linkId ? 'clickable' : ''}`}
                          onClick={(e) => flow.linkId && scrollToSection(flow.linkId, e)}
                        >
                          <div className="step-title">
                            {flow.step}
                            {flow.linkId && <span className="link-indicator">🔗</span>}
                          </div>
                          <div className="step-desc">{flow.desc}</div>
                        </div>
                        {index < item.visualData.length - 1 && (
                          <div className="arrow">↓</div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="original-text-section">
                  <div className="section-header" onClick={(e) => toggleOriginalText(item.id, e)}>
                    <h3>관련 지침 및 법률 원문</h3>
                    <button className="text-toggle-btn">
                      {originalTextExpandedIds.includes(item.id) ? '원문 가리기' : '원문 전체 보기'}
                    </button>
                  </div>
                  {originalTextExpandedIds.includes(item.id) && (
                    <div className="original-text-content animate-in">
                      {item.originalText}
                    </div>
                  )}
                </div>

                {item.forms && (
                  <div className="forms-section">
                    <div className="section-header" onClick={(e) => toggleForms(item.id, e)}>
                      <h3>관련 부록 양식</h3>
                      <button className="text-toggle-btn form-btn">
                        {formExpandedIds.includes(item.id) ? '양식 가리기' : '양식 이미지 보기'}
                      </button>
                    </div>
                    {formExpandedIds.includes(item.id) && (
                      <div className="forms-content animate-in">
                        {item.forms.map((form, i) => (
                          <div key={i} className="form-item">
                            <h4>{form.title}</h4>
                            <FormRenderer page={form.page} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <footer>
        <p>© 2026 학교폭력 사안처리 가이드북 스마트 검색 시스템 (v1.1)</p>
      </footer>
    </div>
  );
};

export default App;
