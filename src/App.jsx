import React, { useEffect, useMemo, useState } from 'react';

const KEY = 'acl-course-pulse-v2';

// Fictional teaching records for the self-contained UI/UX exercise.
// Staff names and course descriptions are examples, not GUC historical records.
const COURSE_CATALOG = {
  CSEN701: {
    name: 'Advanced Computer Lab',
    description: 'A project-focused course emphasizing teamwork, planning, software development, and delivery across several milestones.',
    history: [
      {year: '2025/26', instructors: ['Dr. Mariam Farouk'], tas: ['Yara Hassan', 'Omar Fawzy']},
      {year: '2024/25', instructors: ['Dr. Karim Nabil'], tas: ['Nour Adel', 'Mina Sameh']},
    ],
  },
  MATH204: {
    name: 'Linear Algebra',
    description: 'Vectors, matrices, linear systems, and mathematical methods used in technical problem solving.',
    history: [
      {year: '2025/26', instructors: ['Dr. Salma Younis'], tas: ['Layla Maher', 'Ahmed Sherif']},
      {year: '2024/25', instructors: ['Dr. Rana Hamdy'], tas: ['Youssef Tarek', 'Dina Mourad']},
    ],
  },
  CSEN401: {
    name: 'Software Engineering',
    description: 'Software requirements, architecture, implementation practices, testing, and collaborative development.',
    history: [
      {year: '2025/26', instructors: ['Dr. Tamer Elsayed'], tas: ['Rana Fathy', 'Adham Khalil']},
      {year: '2024/25', instructors: ['Dr. Hala Mansour'], tas: ['Malak Samir', 'Ali Mahmoud']},
    ],
  },
  HUMA101: {
    name: 'Critical Thinking & Communication',
    description: 'A discussion-based course about assessing arguments, presenting ideas, and communicating effectively.',
    history: [
      {year: '2025/26', instructors: ['Dr. Dina Saad'], tas: ['Mariam Hossam', 'Youssef Nader']},
      {year: '2024/25', instructors: ['Dr. Reem Taha'], tas: ['Farah Amr', 'Sara Magdy']},
    ],
  },
  CSEN202: {
    name: 'Data Structures',
    description: 'Core data organization techniques and algorithms, with a focus on selecting suitable structures for different problems.',
    history: [
      {year: '2025/26', instructors: ['Dr. Amina Rashed'], tas: ['Rami Elshamy', 'Nada Wael']},
      {year: '2024/25', instructors: ['Dr. Yasser Salem'], tas: ['Hana Ehab', 'Bassel Mostafa']},
    ],
  },
};
const getCourse = code => COURSE_CATALOG[code?.toUpperCase()] || {
  name: 'Course details not yet added',
  description: 'This course does not have a profile in the example catalog.',
  history: [],
};
const readRoute = () => {
  const match = window.location.hash.match(/^#\/courses\/([^/?#]+)$/);
  return match ? decodeURIComponent(match[1]).toUpperCase() : null;
};
const seed = [
  {id:'r1',courseCode:'CSEN701',rating:4,comment:'A challenging team project. The weekly milestones helped.',owner:'you',name:'You',date:'2026-10-06'},
  {id:'r2',courseCode:'CSEN701',rating:5,comment:'You learn the most when your group communicates well.',owner:'other',name:'Farida',date:'2026-10-02'},
  {id:'r3',courseCode:'MATH204',rating:3,comment:'Useful material but the pace felt fast.',owner:'other',name:'Karim',date:'2026-09-28'},
  {id:'r4',courseCode:'CSEN401',rating:4,comment:'Tutorial exercises are very important.',owner:'you',name:'You',date:'2026-09-24'},
  {id:'r5',courseCode:'HUMA101',rating:5,comment:'Well organized and approachable.',owner:'other',name:'Mariam',date:'2026-09-21'},
  {id:'r6',courseCode:'CSEN701',rating:3,comment:'Good practical work, but demanding during exam week.',owner:'other',name:'Youssef',date:'2026-09-15'},
  {id:'r7',courseCode:'MATH204',rating:5,comment:'Excellent explanation of difficult concepts.',owner:'other',name:'Nadine',date:'2026-08-30'},
  {id:'r8',courseCode:'CSEN401',rating:2,comment:'More worked examples in lectures would help.',owner:'other',name:'Adam',date:'2026-08-17'},
  {id:'r9',courseCode:'CSEN202',rating:4,comment:'The assignments strengthened problem-solving skills.',owner:'other',name:'Hassan',date:'2026-08-09'},
];
function getSaved(){try {let s=JSON.parse(localStorage.getItem(KEY));return Array.isArray(s)?s:seed;}catch{return seed;}}
const avg = a => a.length?(a.reduce((s,r)=>s+r.rating,0)/a.length).toFixed(1):'—';
const stars = n => '★'.repeat(n)+'☆'.repeat(Math.max(0,5-n));
export default function App(){
 const [reviews,setReviews] = useState(getSaved);
 const [search,setSearch] = useState('');
 const [rating,setRating] = useState('all');
 const [course,setCourse] = useState('CSEN701');
 const [editor,setEditor] = useState(null);
 const [error,setError] = useState('');
 const [notice,setNotice] = useState('');
 const [tab,setTab] = useState('Overview');
  const [mineOnly,setMineOnly] = useState(false);
  const [courseQuery,setCourseQuery] = useState('');
  const [courseSort,setCourseSort] = useState('rating');
  const [reviewSort,setReviewSort] = useState('newest');
 const [activeCourseCode,setActiveCourseCode] = useState(readRoute);
 useEffect(()=>{
  const changePage = () => {setActiveCourseCode(readRoute());window.scrollTo({top:0,behavior:'instant'});};
  window.addEventListener('hashchange',changePage);
  return ()=>window.removeEventListener('hashchange',changePage);
 },[]);
 const openCourse = code => {window.location.hash=`#/courses/${encodeURIComponent(code)}`;setActiveCourseCode(code.toUpperCase());window.scrollTo({top:0,behavior:'instant'});};
 const navigateTo = (where) => {
  window.location.hash='#/';
  setActiveCourseCode(null);
  if(where==='reviews')requestAnimationFrame(()=>document.getElementById('review-list')?.scrollIntoView({behavior:'smooth'}));
  else window.scrollTo({top:0,behavior:'smooth'});
 };
 useEffect(()=>localStorage.setItem(KEY,JSON.stringify(reviews)),[reviews]);
 const result = useMemo(()=>reviews.filter(r=>(!mineOnly||r.owner==='you')&&(rating==='all'||r.rating===Number(rating))&&`${r.courseCode} ${r.comment} ${r.name}`.toLowerCase().includes(search.toLowerCase())),[reviews,search,rating,mineOnly]);
 const selected = reviews.filter(x=>x.courseCode.toUpperCase()===course.trim().toUpperCase());
 const uniqueCourses = [...new Set(reviews.map(x=>x.courseCode))];
 const distribution = [5,4,3,2,1].map(n=>({n,total:reviews.filter(r=>r.rating===n).length}));
 const statsFor = code => {const list=reviews.filter(x=>x.courseCode.toUpperCase()===code.toUpperCase());return {list,count:list.length,average:avg(list),mine:list.find(x=>x.owner==='you')};};
  const allCodes = [...new Set([...Object.keys(COURSE_CATALOG),...reviews.map(x=>x.courseCode.toUpperCase())])];
  const courseCards = allCodes.map(code=>({code,...getCourse(code),...statsFor(code)})).filter(c=>`${c.code} ${c.name} ${c.description}`.toLowerCase().includes(courseQuery.trim().toLowerCase())).sort((a,b)=>courseSort==='rating'?(parseFloat(b.average)||0)-(parseFloat(a.average)||0):courseSort==='reviews'?b.count-a.count:a.code.localeCompare(b.code));
  const activeReviews = activeCourseCode?[...statsFor(activeCourseCode).list].sort((a,b)=>reviewSort==='high'?b.rating-a.rating:reviewSort==='low'?a.rating-b.rating:String(b.date).localeCompare(String(a.date))):[];
  const activeDist = [5,4,3,2,1].map(n=>({n,total:activeReviews.filter(r=>r.rating===n).length}));
  const editorCode = editor?editor.courseCode.trim().toUpperCase():'';
  const editorMine = editor&&editorCode?reviews.find(r=>r.id!==editor.id&&r.owner==='you'&&r.courseCode.toUpperCase()===editorCode):null;
  const startReview = code => {const mine=statsFor(code).mine;if(mine)openEditor(mine);else openEditor(null,code);};
  function openEditor(r,code=''){if(r&&r.owner!=='you')return;setError('');setEditor({id:r?.id||null, courseCode:r?.courseCode||code,rating:String(r?.rating||''),comment:r?.comment||''});}
 function submit(e){e.preventDefault();if(!editor.courseCode.trim()){setError('Enter a course code.');return;}if(!/^[1-5]$/.test(editor.rating)){setError('Rating must be from 1 to 5.');return;}if(reviews.some(r=>r.id!==editor.id&&r.owner==='you'&&r.courseCode.toLowerCase()===editor.courseCode.trim().toLowerCase())){setError('You have already reviewed this course.');return;}
 const payload={courseCode:editor.courseCode.trim().toUpperCase(),rating:Number(editor.rating),comment:editor.comment.trim(),name:'You',owner:'you',date:new Date().toISOString().slice(0,10)};
 if(editor.id){setReviews(reviews.map(r=>r.id===editor.id?{...r,...payload}:r));setNotice('Review updated.');}else{setReviews([{...payload,id:'r-'+Date.now()},...reviews]);setNotice(`Review posted for ${payload.courseCode}.`);openCourse(payload.courseCode);}
 setEditor(null);
 }
 function reset(){setReviews(seed);setSearch('');setRating('all');setCourse('CSEN701');setEditor(null);setMineOnly(false);setNotice('Example data restored.');}
  useEffect(()=>{
   if(!editor)return;
   const onKey = e => {if(e.key==='Escape')setEditor(null);};
   window.addEventListener('keydown',onKey);
   return ()=>window.removeEventListener('keydown',onKey);
  },[editor]);
  const nav = activeCourseCode?'Overview':tab;
  const goCourses = () => {setTab('Overview');navigateTo('top');};
  const goReviews = () => {setMineOnly(false);setTab('Browse');navigateTo('reviews');};
  const goMine = () => {setMineOnly(true);setSearch('');setRating('all');setTab('Mine');navigateTo('reviews');};
  const clearFilters = () => {setSearch('');setRating('all');setMineOnly(false);};
  const ratingWords = {1:'Poor',2:'Fair',3:'Good',4:'Very good',5:'Excellent'};
  const activeStats = activeCourseCode?statsFor(activeCourseCode):null;
  const editorStats = editorCode?statsFor(editorCode):null;
  const Stars = ({value}) => <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>{stars(value)}</span>;
  return <div className="review-app">
   <aside className="sidebar">
    <div className="logo"><span>✦</span> course<span>pulse</span></div>
    <div className="side-caption">EXPLORE</div>
    <button className={nav==='Overview'?'active':''} onClick={goCourses}><span>▦</span> Find courses</button>
    <button className={nav==='Browse'?'active':''} onClick={goReviews}><span>≡</span> All reviews</button>
    <div className="side-caption gap">YOUR SPACE</div>
    <button className={nav==='Mine'?'active':''} onClick={goMine}><span>♡</span> Your reviews</button>
    <button onClick={()=>openEditor(null,activeCourseCode||'')}><span>＋</span> Write a review</button>
    <div className="side-end"><div className="badge-face">Y</div><div><strong>Your account</strong><small>Student profile</small></div></div>
   </aside>
   <main className="content">
    {notice&&<div className="notice" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="Dismiss message">✕</button></div>}
    {activeCourseCode ? (
     <section className="course-detail-page">
      <div className="crumbs">
       <button type="button" className="back-to-reviews" onClick={goCourses}>← All courses</button>
       <button type="button" className="back-to-reviews" onClick={goReviews}>Back to reviews</button>
      </div>
      <header className="course-hero">
       <div>
        <p className="eyebrow">COURSE PROFILE</p>
        <h1>{getCourse(activeCourseCode).name}</h1>
        <p className="course-id">{activeCourseCode}</p>
        <p className="course-description">{getCourse(activeCourseCode).description}</p>
       </div>
       <div className="course-mini-score">
        <small>COURSE AVERAGE</small>
        <strong>{activeStats.average}</strong>
        {activeStats.count>0&&<Stars value={Math.round(parseFloat(activeStats.average))}/>}
        <span>{activeStats.count} review(s)</span>
        <button className="post-review" onClick={()=>startReview(activeCourseCode)}>{activeStats.mine?'Edit your review':'＋ Write a review'}</button>
       </div>
      </header>
      <nav className="other-courses" aria-label="Other courses">
       <small>COMPARE WITH</small>
       {allCodes.filter(c=>c!==activeCourseCode).map(c=><button type="button" key={c} onClick={()=>openCourse(c)}><strong>{c}</strong><span>{statsFor(c).average} ★ · {statsFor(c).count}</span></button>)}
      </nav>
      <div className="course-details-grid">
       <section className="panel teaching-history">
        <h2>Teaching history</h2>
        <p>Instructors and teaching assistants for the previous two academic years.</p>
        {getCourse(activeCourseCode).history.length ? getCourse(activeCourseCode).history.map(entry=><div className="teaching-entry" key={entry.year}>
         <h3>{entry.year}</h3>
         <div><small>INSTRUCTOR{entry.instructors.length===1?'':'S'}</small><span>{entry.instructors.join(', ')}</span></div>
         <div><small>TEACHING ASSISTANTS</small><span>{entry.tas.join(', ')}</span></div>
        </div>) : <p className="history-empty">No example teaching records for this course.</p>}
        <p className="teaching-disclaimer">Illustrative course and teaching records; staff names are fictional.</p>
       </section>
       <section className="panel course-feedback">
        <div className="detail-review-head">
         <div><h2>Student reviews</h2><p>Feedback for {activeCourseCode} from the example community.</p></div>
         <button className="post-review" onClick={()=>startReview(activeCourseCode)}>{activeStats.mine?'Edit your review':`＋ Review ${activeCourseCode}`}</button>
        </div>
        <div className="course-summary-row">
         <div className="rating-bars">{activeDist.map(d=><div key={d.n} className="rating-row"><span>{d.n}★</span><div className="barbg"><i style={{width:`${d.total/Math.max(...activeDist.map(x=>x.total),1)*100}%`}}/></div><small>{d.total}</small></div>)}</div>
         <label className="sort-select"><span>Sort reviews</span><select value={reviewSort} onChange={e=>setReviewSort(e.target.value)}><option value="newest">Newest first</option><option value="high">Highest rated</option><option value="low">Lowest rated</option></select></label>
        </div>
        {activeReviews.length ? activeReviews.map(r=><article className={`course-review${r.owner==='you'?' mine':''}`} key={r.id}>
         <div className="course-review-top">
          <div className="reviewer"><i className="avatar">{r.name.charAt(0)}</i><strong>{r.name}</strong>{r.owner==='you'&&<em className="you-badge">Your review</em>}</div>
          <Stars value={r.rating}/>
         </div>
         <p>{r.comment||'No comment provided'}</p>
         <div className="course-review-meta"><span>{r.date||'Recently'}</span>{r.owner==='you'&&<button className="row-edit" onClick={()=>openEditor(r)}>Edit your review</button>}</div>
        </article>) : <div className="course-review-empty">No reviews for this course yet. Be the first to share your experience.</div>}
       </section>
      </div>
     </section>
    ) : <>
     <header className="page-head hero">
      <div>
       <p className="eyebrow">ACADEMIC FEEDBACK PORTAL</p>
       <h1>Course Review Board</h1>
       <p>Choose a course with confidence: read what students said, then share your own experience.</p>
       <ol className="steps"><li><b>1</b> Find a course</li><li><b>2</b> Read feedback</li><li><b>3</b> Write your review</li></ol>
      </div>
      <button className="post-review" onClick={()=>openEditor(null)}>＋ Write review</button>
     </header>
     <section className="panel course-finder" id="course-finder">
      <div className="panel-head reviews-heading"><div><h2>1. Find a course</h2><p>Compare courses by rating and feedback, then open one to read what students said.</p></div></div>
      <div className="searchbar">
       <div className="searchinput"><span>⌕</span><input value={courseQuery} onChange={e=>setCourseQuery(e.target.value)} aria-label="Search courses" placeholder="Search by course name or code"/></div>
       <label><span>Sort by</span><select value={courseSort} onChange={e=>setCourseSort(e.target.value)}><option value="rating">Highest rated</option><option value="reviews">Most reviewed</option><option value="code">Course code</option></select></label>
      </div>
      <div className="course-cards">
       {courseCards.map(c=><article className="course-card" key={c.code}>
        <div className="course-card-top">
         <div><strong>{c.code}</strong><span>{c.name}</span></div>
         <div className="card-score"><b>{c.average}</b><small>{c.count} review{c.count===1?'':'s'}</small></div>
        </div>
        {c.count>0?<Stars value={Math.round(parseFloat(c.average))}/>:<span className="no-reviews">No reviews yet</span>}
        <p>{c.description}</p>
        {c.mine&&<span className="you-badge">✓ You reviewed this</span>}
        <div className="card-actions">
         <button type="button" className="primary-action" onClick={()=>openCourse(c.code)}>Read feedback →</button>
         <button type="button" className="outline" onClick={()=>startReview(c.code)}>{c.mine?'Edit your review':'＋ Review'}</button>
        </div>
       </article>)}
       {courseCards.length===0&&<p className="history-empty">No courses match your search. <button type="button" className="row-edit" onClick={()=>setCourseQuery('')}>Clear search</button></p>}
      </div>
     </section>
     <section className="metrics">
      <div className="metric"><small>ALL REVIEWS</small><strong>{reviews.length}</strong><span>Community contributions</span></div>
      <div className="metric"><small>AVERAGE SCORE</small><strong>{avg(reviews)} <em>/ 5</em></strong><span>Calculated across entries</span></div>
      <div className="metric"><small>COURSES RATED</small><strong>{uniqueCourses.length}</strong><span>Unique course codes</span></div>
     </section>
     <div className="analytic-grid">
      <section className="panel pulse">
       <div className="panel-head"><div><h2>Community rating overview</h2><p>Ratings from recent student submissions</p></div><span className="dots">···</span></div>
       <div className="pulse-content">
        <div className="donut"><div><span>{avg(reviews)}</span><small>AVERAGE</small></div></div>
        <div className="rating-bars">{distribution.map(d=><div key={d.n} className="rating-row"><span>{d.n}★</span><div className="barbg"><i style={{width:`${d.total/Math.max(...distribution.map(x=>x.total),1)*100}%`}}/></div><small>{d.total}</small></div>)}</div>
       </div>
      </section>
      <section className="panel summary">
       <div className="panel-head"><div><h2>Course score lookup</h2><p>Check the average score for one course code.</p></div></div>
       <label>Course code<input value={course} onChange={e=>setCourse(e.target.value)} placeholder="Course code"/></label>
       <div className="score"><span>Overall rating</span><strong>{avg(selected)}</strong><small>{selected.length} review(s)</small></div>
       <div className="banner">Data updates as new reviews are added.</div>
       {course.trim()&&<button type="button" className="lookup-course-link" onClick={()=>openCourse(course.trim().toUpperCase())}>View course details →</button>}
      </section>
     </div>
     <section className="review-list panel" id="review-list">
      <div className="panel-head reviews-heading"><div><h2>2. Explore student reviews</h2><p>Find a comment by course, rating or student.</p></div><button className="outline" onClick={reset}>Reset demo</button></div>
      <div className="chips" role="group" aria-label="Review scope">
       <button type="button" className={!mineOnly?'chip on':'chip'} aria-pressed={!mineOnly} onClick={()=>setMineOnly(false)}>All reviews</button>
       <button type="button" className={mineOnly?'chip on':'chip'} aria-pressed={mineOnly} onClick={()=>setMineOnly(true)}>Your reviews</button>
      </div>
      <div className="searchbar">
       <div className="searchinput"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} aria-label="Search reviews" placeholder="Search by course, comment or student"/></div>
       <label><span>Rating</span><select value={rating} onChange={e=>setRating(e.target.value)}><option value="all">All ratings</option>{[5,4,3,2,1].map(n=><option key={n} value={n}>{n} stars</option>)}</select></label>
       <button onClick={()=>{clearFilters();setNotice('Filters cleared.');setTab('Browse');}}>Clear filters</button>
      </div>
      <div className="rows-wrapper"><table><thead><tr><th>Course</th><th>Stars</th><th>Student comment</th><th>Reviewer</th><th>Date</th><th>Action</th></tr></thead><tbody>
       {result.map(r=><tr key={r.id}>
        <td><button type="button" className="course-link" title={`View ${getCourse(r.courseCode).name}`} onClick={()=>openCourse(r.courseCode)}><strong>{r.courseCode}</strong><small>{getCourse(r.courseCode).name}</small></button></td>
        <td className="ratingcell">{stars(r.rating)}</td>
        <td className="commentcell">{r.comment||'No comment provided'}</td>
        <td>{r.name}</td>
        <td>{r.date||'Recently'}</td>
        <td>{r.owner==='you'?<button className="row-edit" onClick={()=>openEditor(r)}>Edit</button>:<span className="dim">—</span>}</td>
       </tr>)}
       {result.length===0&&<tr><td colSpan="6">No reviews found. <button type="button" className="row-edit" onClick={clearFilters}>Clear filters</button></td></tr>}
      </tbody></table></div>
      <p className="tablefoot">{result.length} of {reviews.length} reviews • Campus feedback platform</p>
     </section>
    </>}
   </main>
   {editor&&<div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setEditor(null)}>
    <div className="modal" role="dialog" aria-modal="true" aria-label="Write review">
     <div className="modal-title">
      <div><p className="eyebrow">YOUR CONTRIBUTION</p><h2>{editor.id?'Edit review':'Write a course review'}</h2><p>{editorCode&&COURSE_CATALOG[editorCode]?`Reviewing ${COURSE_CATALOG[editorCode].name}`:'Share a rating and a short comment.'}</p></div>
      <button onClick={()=>setEditor(null)} aria-label="Close">✕</button>
     </div>
     <form onSubmit={submit}>
      <label>Course code
       <input list="course-options" autoFocus={!editor.courseCode} value={editor.courseCode} onChange={e=>setEditor(s=>({...s,courseCode:e.target.value}))} placeholder="CSEN701"/>
       <datalist id="course-options">{allCodes.map(c=><option key={c} value={c}>{getCourse(c).name}</option>)}</datalist>
       {editorCode&&<small className="field-hint">{COURSE_CATALOG[editorCode]?COURSE_CATALOG[editorCode].name:'Not in the course catalog yet'}{editorStats.count>0&&` · ${editorStats.average} average from ${editorStats.count} review${editorStats.count===1?'':'s'}`}{editorMine&&<> · You already reviewed this course. <button type="button" className="row-edit" onClick={()=>openEditor(editorMine)}>Edit that review</button></>}</small>}
      </label>
      <div className="field">
       <span id="rating-label">Overall rating</span>
       <div className="star-picker" role="radiogroup" aria-labelledby="rating-label">
        {[1,2,3,4,5].map(n=><button type="button" key={n} role="radio" aria-checked={Number(editor.rating)===n} aria-label={`${n} star${n>1?'s':''}`} className={Number(editor.rating)>=n?'on':''} onClick={()=>setEditor(s=>({...s,rating:String(n)}))}>★</button>)}
        <em>{ratingWords[editor.rating]||'Choose a rating'}</em>
       </div>
      </div>
      <label>Comment<textarea value={editor.comment} rows={5} onChange={e=>setEditor(s=>({...s,comment:e.target.value}))} placeholder="What should future students know? (optional)"/></label>
      {error&&<div className="formerror" role="alert">{error}</div>}
      <div className="modal-actions"><button type="button" onClick={()=>setEditor(null)}>Cancel</button><button className="post-review" type="submit">{editor.id?'Save review':'Submit review'}</button></div>
     </form>
    </div>
   </div>}
  </div>;
}
