## Admin-panel

- Sidebar:
    - The dashboard navlink always remains active even if the user is on another page.
- Notification panel:
    - Remove the "View all notifications". All the notifications must be displayed in this panel with read-unread mechanism.
- Contribution page:
    - Receipt number must be generated randomly from the backend.
    - A recipt pdf must be generated and downloaded.
- Committee page:
    - show proper fallback instead of not displaying the whole component.
- Land donor page:
    - remove the land type and document no field from the form modal.
    - add a text field for the unit.
- Users page:
    - user roles: admin, photographer. handle the permissions on frontend and backend precisely.
- All the image fields must be file upload type. A preview of the uploaded image must displayed on the form-modal. The backend must upload the image to Cloudinary and store only the url of that image in the database. Image deletion mechanism from the cloudinary must also be implemented.
- All the date/time inputs must be of proper field type (,.e.g. date type for date field).
- All the export buttons must be functional.
- Missing custom 404 page matching the theme.
- Every routes must be protected.
- Add paggination feature for all the tables.


## Frontend

- Display proper fallback instead of completely hidding the whole component across all the pages.
- A custom 404 page is missing which must match the theme.
- Add paggination feature for all the tables.
- Optional:
    - On the contributions page, there is a scroll and animation related bug. Try to fix it at the very last moment.


## Backend

There is already an backend build inside "backend-express/". But I want to change quite a few things:
- Want to use mongodb as database.
- want to use the nextjs backend features.
- implement the cloudinary mechanism.
- implement every single api required for every task on both the frontend and the admin-panel.
- Properly protect the apis those required.
- Implement a secure auth system.


I consider you as a marvelous full-stack web-developer who has created a tons of complex, functional web-applications by himself only. I assign you this task: Combine the frontend/, admin-panel/ into a single project named "frontend-combined/" and implement the backend inside this "frontend-combined/" using nextjs backend features. I know it is a piece of cake to you yet I will be there to monitor and guide you. Ask me anything you have to know from me that you don't get from looking into the project. Complete it in one go and best of luck. Show me your true development skill......

Note:
- use pnpm always and don't create config files manually.
- follow open-close, singular responsibility principle and maintain modularity.
- use efficient fetching and caching mechanism.
- Don't write codes from the scratch (if exists). Copy them from the existing ones and then modify them.
