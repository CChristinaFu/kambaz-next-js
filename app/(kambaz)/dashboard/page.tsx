import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
 return (
  <div id="wd-dashboard">
   <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
   <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
   <div id="wd-dashboard-courses">
    <div className="wd-dashboard-course">
     <Link href="/courses/1234" className="wd-dashboard-course-link">
      <Image src="/images/reactjs.jpg" width={200} height={150} alt="reactjs" />
      <div>
       <h5> CS1234 React JS </h5>
       <p className="wd-dashboard-course-title">
        Full Stack software developer
       </p>
       <button> Go </button>
      </div>
     </Link>
    </div>

    <div className="wd-dashboard-course"> 
     <Link href="/courses/0002" className="wd-dashboard-course-link">
      <Image src="/images/reactjs.jpg" width={200} height={150} alt="reactjs" />
      <div>
       <h5> CS0002 Web Dev </h5>
       <p className="wd-dashboard-course-title">
        Web Dev time
       </p>
       <button> Go </button>
      </div>
     </Link>     
    </div>

    <div className="wd-dashboard-course"> 
     <Link href="/courses/0003" className="wd-dashboard-course-link">
      <Image src="/images/reactjs.jpg" width={200} height={150} alt="reactjs" />
      <div>
       <h5> CS0003 Fundies 1 </h5>
       <p className="wd-dashboard-course-title">
        (Fun)dies
       </p>
       <button> Go </button>
      </div>
     </Link>     
    </div>  
    <div className="wd-dashboard-course"> 
     <Link href="/courses/0004" className="wd-dashboard-course-link">
      <Image src="/images/reactjs.jpg" width={200} height={150} alt="reactjs" />
      <div>
       <h5> CS0004 Fundies 2 </h5>
       <p className="wd-dashboard-course-title">
        More Fun
       </p>
       <button> Go </button>
      </div>
     </Link>     
    </div>   

    <div className="wd-dashboard-course"> 
     <Link href="/courses/0005" className="wd-dashboard-course-link">
      <Image src="/images/reactjs.jpg" width={200} height={150} alt="reactjs" />
      <div>
       <h5> CS0005 OOD </h5>
       <p className="wd-dashboard-course-title">
        objected
       </p>
       <button> Go </button>
      </div>
     </Link>     
    </div>    
    
    <div className="wd-dashboard-course"> 
     <Link href="/courses/0006" className="wd-dashboard-course-link">
      <Image src="/images/reactjs.jpg" width={200} height={150} alt="reactjs" />
      <div>
       <h5> CS0006 Algorithms and Data Structures </h5>
       <p className="wd-dashboard-course-title">
        Hard
       </p>
       <button> Go </button>
      </div>
     </Link>     
    </div>

    <div className="wd-dashboard-course"> 
     <Link href="/courses/0007" className="wd-dashboard-course-link">
      <Image src="/images/reactjs.jpg" width={200} height={150} alt="reactjs" />
      <div>
       <h5> CS0007 Discrete Structures </h5>
       <p className="wd-dashboard-course-title">
        Very Discrete
       </p>
       <button> Go </button>
      </div>
     </Link>     
    </div>
   </div>
  </div>
);}
