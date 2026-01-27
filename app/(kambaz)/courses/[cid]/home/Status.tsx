// app/(kambaz)/courses/[cid]/home/Status.tsx

export default function CourseStatus() {
  return (
    <div id="wd-course-status">
      <h2>Course Status</h2>

      <div id="wd-course-status-publish">
        <button id="wd-unpublish">Unpublish</button>{" "}
        <button id="wd-publish">Publish</button>
      </div>

      <br />

      <div id="wd-course-status-actions">
        <button id="wd-import-existing-content">
          Import Existing Content
        </button>
        <br />
        <button id="wd-import-from-commons">
          Import From Commons
        </button>
        <br />
        <button id="wd-choose-home-page">
          Choose Home Page
        </button>
        <br />
        <button id="wd-view-course-stream">
          View Course Stream
        </button>
        <br />
        <button id="wd-new-announcement">
          New Announcement
        </button>
        <br />
        <button id="wd-new-analytics">
          New Analytics
        </button>
        <br />
        <button id="wd-view-course-notifications">
          View Course Notifications
        </button>
      </div>
  
    </div>
  );
}
