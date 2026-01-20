import React from 'react'
import { BookOpen, BookMarked, Calendar, ListChecks } from 'lucide-react'
import { trackTemplateSelection } from '../PostHogProvider'

const TemplateSelector = ({ template, setTemplate }) => {
  const handleTemplateChange = (newTemplate) => {
    if (newTemplate !== template) {
      trackTemplateSelection(newTemplate, {
        previous_template: template
      })
      setTemplate(newTemplate)
    }
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label className="rrg-label">Receipt Template</label>
      <div className="rrg-template-grid rrg-template-grid--main">
        <button 
          className={`rrg-template-button ${template === 'standard' ? 'active' : ''}`}
          onClick={() => handleTemplateChange('standard')}
        >
          <BookOpen size={18} />
          <span>Default</span>
        </button>
        <button 
          className={`rrg-template-button ${template === 'yearly' ? 'active' : ''}`}
          onClick={() => handleTemplateChange('yearly')}
        >
          <Calendar size={18} />
          <span>Year</span>
        </button>
        <button 
          className={`rrg-template-button ${template === 'monthly' ? 'active' : ''}`}
          onClick={() => handleTemplateChange('monthly')}
        >
          <Calendar size={18} />
          <span>Monthly</span>
        </button>
        <button 
          className={`rrg-template-button ${template === 'seasonal' ? 'active' : ''}`}
          onClick={() => handleTemplateChange('seasonal')}
        >
          <Calendar size={18} />
          <span>Season</span>
        </button>
        <button 
          className={`rrg-template-button ${template === 'tbr' ? 'active' : ''}`}
          onClick={() => handleTemplateChange('tbr')}
        >
          <ListChecks size={18} />
          <span>TBR</span>
        </button>
        <button 
          className={`rrg-template-button ${template === 'current' ? 'active' : ''}`}
          onClick={() => handleTemplateChange('current')}
        >
          <BookMarked size={18} />
          <span>Current</span>
        </button>
      </div>
    </div>
  )
}

export default TemplateSelector
