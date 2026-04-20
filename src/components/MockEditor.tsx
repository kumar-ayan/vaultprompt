import styles from './MockEditor.module.css';

export default function MockEditor() {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarSkeleton}></div>
        <div className={styles.sidebarSkeleton}></div>
        <div className={styles.sidebarSkeleton}></div>
      </div>
      
      <div className={styles.editorBox}>
        <div className={styles.header}>
          <div className={styles.tab}></div>
          <div className={styles.headerDots}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        </div>
        
        <div className={styles.codeArea}>
          <span>{'// Writing an SEO blog post'}</span><br/>
          <span>System: You are an expert content strategist...</span><br/>
          <span>User: Generate a 1000-word article about [topic]...</span><br/><br/>
          &nbsp;&nbsp;Analyzing for tokens and output efficiency...
        </div>
        
        <div className={styles.efficiencyBox}>
          <div className={styles.efficiencyLabel}>Efficiency Score</div>
          <div className={styles.efficiencyValue}>94.2%</div>
        </div>
      </div>
    </div>
  );
}
