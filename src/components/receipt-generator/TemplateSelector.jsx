import React from 'react'
import { BookOpen, BookMarked, Calendar, ListChecks } from 'lucide-react'

const TemplateSelector = ({ template, setTemplate }) => {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label className="rrg-label">Receipt Template</label>
      <div className="rrg-template-grid rrg-template-grid--main">
        <button 
          className={`rrg-template-button ${template === 'standard' ? 'active' : ''}`}
          onClick={() => setTemplate('standard')}
        >
          <BookOpen size={18} />
          <span>Default</span>
        </button>
        <button 
          className={`rrg-template-button ${template === 'yearly' ? 'active' : ''}`}
          onClick={() => setTemplate('yearly')}
        >
          <Calendar size={18} />
          <span>Year</span>
        </button>
        <button 
          className={`rrg-template-button ${template === 'monthly' ? 'active' : ''}`}
          onClick={() => setTemplate('monthly')}
        >
          <Calendar size={18} />
          <span>Monthly</span>
        </button>
        <button 
          className={`rrg-template-button ${template === 'seasonal' ? 'active' : ''}`}
          onClick={() => setTemplate('seasonal')}
        >
          <Calendar size={18} />
          <span>Season</span>
        </button>
        <button 
          className={`rrg-template-button ${template === 'tbr' ? 'active' : ''}`}
          onClick={() => setTemplate('tbr')}
        >
          <ListChecks size={18} />
          <span>TBR</span>
        </button>
        <button 
          className={`rrg-template-button ${template === 'current' ? 'active' : ''}`}
          onClick={() => setTemplate('current')}
        >
          <BookMarked size={18} />
          <span>Current</span>
        </button>
      </div>
    </div>
  )
}

export default TemplateSelector
