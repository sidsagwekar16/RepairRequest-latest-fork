import { MailService } from '@sendgrid/mail';

// Initialize SendGrid service only if API key is available
let mailService: MailService | null = null;
const isEmailServiceAvailable = !!process.env.SENDGRID_API_KEY;

if (isEmailServiceAvailable) {
  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY!);
  console.log('SendGrid email service initialized successfully');
} else {
  console.warn('SendGrid API key not found - email notifications will be disabled');
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    console.log('Attempting to send email:', {
      to: params.to,
      from: params.from,
      subject: params.subject
    });
    
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return false;
  }
}

interface RequestEmailData {
  requestId: number;
  requestType: 'facility' | 'building';
  title: string;
  description: string;
  priority: string;
  location?: string;
  building?: string;
  roomNumber?: string;
  requesterName: string;
  requesterEmail: string;
  organizationName: string;
  createdAt: Date;
}

// Function to send emails using SendGrid dynamic templates
async function sendTemplatedEmails(
  requestData: RequestEmailData,
  adminEmails: string[],
  fromEmail: string,
  requesterTemplateId: string,
  adminTemplateId: string
): Promise<void> {
  console.log('Using SendGrid dynamic templates');
  console.log('Requester template:', requesterTemplateId);
  console.log('Admin template:', adminTemplateId);

  // Prepare dynamic template data
  const templateData = {
    request_id: requestData.requestId,
    request_type: requestData.requestType,
    request_type_title: requestData.requestType.charAt(0).toUpperCase() + requestData.requestType.slice(1),
    title: requestData.title,
    description: requestData.description,
    priority: requestData.priority,
    priority_upper: requestData.priority.toUpperCase(),
    location: requestData.location,
    building: requestData.building || '',
    room_number: requestData.roomNumber || '',
    requester_name: requestData.requesterName,
    requester_email: requestData.requesterEmail,
    organization_name: requestData.organizationName,
    submitted_date: requestData.createdAt.toLocaleDateString(),
    submitted_time: requestData.createdAt.toLocaleTimeString(),
    has_building: !!requestData.building,
    has_room: !!requestData.roomNumber,
    priority_class: `priority-${requestData.priority}`,
    location_info: requestData.requestType === 'building' 
      ? `${requestData.building}, Room ${requestData.roomNumber}`
      : requestData.location
  };

  try {
    // Send email to requester using template
    console.log('Sending templated requester notification...');
    await mailService.send({
      to: requestData.requesterEmail,
      from: fromEmail,
      templateId: requesterTemplateId,
      dynamicTemplateData: templateData
    });
    console.log('Requester notification sent successfully');

    // Send emails to admins using template
    console.log('Sending templated admin notifications...');
    for (const adminEmail of adminEmails) {
      await mailService.send({
        to: adminEmail,
        from: fromEmail,
        templateId: adminTemplateId,
        dynamicTemplateData: templateData
      });
    }
    console.log('Admin notifications sent successfully');

    console.log(`Templated notification emails sent for request #${requestData.requestId}`);
  } catch (error) {
    console.error('Failed to send templated emails:', error);
    console.error('Template data used:', JSON.stringify(templateData, null, 2));
    throw error;
  }
}

export async function sendRequestNotificationEmails(
  requestData: RequestEmailData,
  adminEmails: string[]
): Promise<void> {
  console.log('=== EMAIL NOTIFICATION FUNCTION CALLED ===');
  console.log('Request data:', JSON.stringify(requestData, null, 2));
  console.log('Admin emails:', adminEmails);
  console.log('SendGrid API key exists:', !!process.env.SENDGRID_API_KEY);
  
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'notifications@SchoolHouselogistics.com';
  
  // SendGrid template IDs - configure these in your SendGrid account
  const REQUESTER_TEMPLATE_ID = process.env.SENDGRID_REQUESTER_TEMPLATE_ID || 'd-2da91c2d43c54e968dba7e20f8f30d27';
  const ADMIN_TEMPLATE_ID = process.env.SENDGRID_ADMIN_TEMPLATE_ID || 'd-350141c85514463b885f6fcf3f4a44f9';
  
  // Use templates if configured, otherwise fall back to inline HTML
  if (REQUESTER_TEMPLATE_ID && ADMIN_TEMPLATE_ID) {
    return sendTemplatedEmails(requestData, adminEmails, fromEmail, REQUESTER_TEMPLATE_ID, ADMIN_TEMPLATE_ID);
  }
  
  // Email template for new request notification
  const generateEmailContent = (isForRequester: boolean) => {
    const subject = isForRequester 
      ? `Your ${requestData.requestType} request has been submitted - #${requestData.requestId}`
      : `New ${requestData.requestType} request submitted - #${requestData.requestId}`;
    
    const locationInfo = requestData.requestType === 'building' 
      ? `Building: ${requestData.building}\nRoom: ${requestData.roomNumber}`
      : `Location: ${requestData.location}`;
    
    const greeting = isForRequester 
      ? `Dear ${requestData.requesterName},`
      : `Dear Administrator,`;
    
    const mainMessage = isForRequester
      ? `Your ${requestData.requestType} request has been successfully submitted and assigned ID #${requestData.requestId}.`
      : `A new ${requestData.requestType} request has been submitted by ${requestData.requesterName}.`;
    
    const text = `${greeting}

${mainMessage}

Request Details:
- Request ID: #${requestData.requestId}
- Type: ${requestData.requestType.charAt(0).toUpperCase() + requestData.requestType.slice(1)} Request
- Title: ${requestData.title}
- Priority: ${requestData.priority.toUpperCase()}
- ${locationInfo}
- Description: ${requestData.description}
- Submitted by: ${requestData.requesterName} (${requestData.requesterEmail})
- Organization: ${requestData.organizationName}
- Date: ${requestData.createdAt.toLocaleDateString()} at ${requestData.createdAt.toLocaleTimeString()}

${isForRequester 
  ? 'You will receive updates as your request is processed by our maintenance team.'
  : 'Please log in to the system to review and assign this request to maintenance staff.'
}

Best regards,
${requestData.organizationName} Maintenance Team`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0079F2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #0079F2; }
        .priority-high { border-left-color: #dc3545; }
        .priority-medium { border-left-color: #ffc107; }
        .priority-low { border-left-color: #28a745; }
        .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>${requestData.organizationName}</h2>
            <p>Maintenance Request System</p>
        </div>
        <div class="content">
            <p>${greeting}</p>
            <p>${mainMessage}</p>
            
            <div class="details priority-${requestData.priority}">
                <h3>Request Details</h3>
                <p><strong>Request ID:</strong> #${requestData.requestId}</p>
                <p><strong>Type:</strong> ${requestData.requestType.charAt(0).toUpperCase() + requestData.requestType.slice(1)} Request</p>
                <p><strong>Title:</strong> ${requestData.title}</p>
                <p><strong>Priority:</strong> ${requestData.priority.toUpperCase()}</p>
                <p><strong>${requestData.requestType === 'building' ? 'Building:' : 'Location:'}</strong> ${requestData.requestType === 'building' ? requestData.building : requestData.location}</p>
                ${requestData.roomNumber ? `<p><strong>Room:</strong> ${requestData.roomNumber}</p>` : ''}
                <p><strong>Description:</strong> ${requestData.description}</p>
                <p><strong>Submitted by:</strong> ${requestData.requesterName} (${requestData.requesterEmail})</p>
                <p><strong>Date:</strong> ${requestData.createdAt.toLocaleDateString()} at ${requestData.createdAt.toLocaleTimeString()}</p>
            </div>
            
            <p>${isForRequester 
              ? 'You will receive updates as your request is processed by our maintenance team.'
              : 'Please log in to the system to review and assign this request to maintenance staff.'
            }</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>${requestData.organizationName} Maintenance Team</p>
        </div>
    </div>
</body>
</html>`;

    return { subject, text, html };
  };

  try {
    // Send email to requester
    const requesterEmail = generateEmailContent(true);
    await sendEmail({
      to: requestData.requesterEmail,
      from: fromEmail,
      subject: requesterEmail.subject,
      text: requesterEmail.text,
      html: requesterEmail.html,
    });

    // Send email to all admins
    const adminEmail = generateEmailContent(false);
    for (const adminEmailAddress of adminEmails) {
      await sendEmail({
        to: adminEmailAddress,
        from: fromEmail,
        subject: adminEmail.subject,
        text: adminEmail.text,
        html: adminEmail.html,
      });
    }

    console.log(`Request notification emails sent for request #${requestData.requestId}`);
  } catch (error) {
    console.error('Error sending request notification emails:', error);
    throw error;
  }
}