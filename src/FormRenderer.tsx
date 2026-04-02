import React from 'react';

interface FormProps {
  page: number;
}

export const FormRenderer: React.FC<FormProps> = ({ page }) => {
  // 추출된 이미지 경로 (public/forms/page-XXX.png)
  // pdftocairo는 페이지 번호를 146 -> 146 등으로 출력하므로 page 번호를 그대로 사용합니다.
  const imageSrc = `/forms/page-${page}.png`;

  return (
    <div className="form-container animate-in">
      <div className="form-image-wrapper">
        <img 
          src={imageSrc} 
          alt={`가이드북 부록 양식 ${page}페이지`} 
          className="form-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/800x1000?text=Form+Image+Not+Found';
          }}
        />
      </div>
      <div className="form-download-hint">
        💡 이미지를 마우스 오른쪽 버튼으로 클릭하여 '다른 이름으로 저장'하면 실제 양식을 내려받을 수 있습니다.
      </div>
    </div>
  );
};
