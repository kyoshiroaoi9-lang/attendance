import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const roles = ["student", "teacher"] as const;

type Role = (typeof roles)[number];

type Registration = {
  id: string;
  role: Role;
  fullName: string;
  email: string;
  gradeLevel?: string;
  studentId?: string;
  subject?: string;
  employeeId?: string;
  createdAt: string;
};

type RegistrationFormValues = {
  role: Role;
  fullName: string;
  email: string;
  gradeLevel?: string;
  studentId?: string;
  subject?: string;
  employeeId?: string;
};

const today = () => new Date().toLocaleDateString();

const buildPrintableHtml = (registrations: Registration[]) => {
  const rows = registrations
    .map(
      (registration, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${registration.fullName}</td>
          <td>${registration.role}</td>
          <td>${registration.email}</td>
          <td>${registration.role === "student" ? registration.gradeLevel ?? "" : registration.subject ?? ""}</td>
          <td>${registration.role === "student" ? registration.studentId ?? "" : registration.employeeId ?? ""}</td>
          <td>${registration.createdAt}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <html>
      <head>
        <title>Registration Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
          h1 { margin: 0 0 8px; }
          p { margin: 0 0 16px; color: #4b5563; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
          th { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h1>Registration Report</h1>
        <p>Generated: ${today()}</p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Grade/Subject</th>
              <th>ID</th>
              <th>Registered at</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `;
};

export default function App() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    defaultValues: {
      role: "student",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = (data: RegistrationFormValues) => {
    const entry: Registration = {
      id: crypto.randomUUID(),
      createdAt: new Date().toLocaleString(),
      ...data,
    };

    setRegistrations((prev) => [entry, ...prev]);
    reset({
      role: data.role,
      fullName: "",
      email: "",
      gradeLevel: "",
      studentId: "",
      subject: "",
      employeeId: "",
    });
  };

  const summary = useMemo(() => {
    const studentCount = registrations.filter(
      (registration) => registration.role === "student",
    ).length;
    const teacherCount = registrations.filter(
      (registration) => registration.role === "teacher",
    ).length;

    return {
      studentCount,
      teacherCount,
      total: registrations.length,
    };
  }, [registrations]);

  const handleDownload = () => {
    if (!registrations.length) {
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildPrintableHtml(registrations));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="pill">Attendance Hub</p>
          <h1>Student & Teacher Registration</h1>
          <p className="subtitle">
            Capture attendee details and export a ready-to-share PDF summary in
            seconds.
          </p>
        </div>
        <button
          type="button"
          className="primary"
          onClick={handleDownload}
          disabled={!registrations.length}
        >
          Download PDF
        </button>
      </header>

      <main className="layout">
        <section className="card">
          <h2>Registration form</h2>
          <p className="muted">
            Select a role and complete the required fields.
          </p>
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <label>
              Role
              <select {...register("role")}>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role[0].toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Full name
              <input
                {...register("fullName", { required: "Full name is required" })}
                placeholder="Jordan Lee"
              />
              {errors.fullName && (
                <span className="error">{errors.fullName.message}</span>
              )}
            </label>

            <label>
              Email
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/, 
                    message: "Enter a valid email",
                  },
                })}
                placeholder="name@school.edu"
              />
              {errors.email && (
                <span className="error">{errors.email.message}</span>
              )}
            </label>

            {selectedRole === "student" ? (
              <>
                <label>
                  Grade level
                  <input
                    {...register("gradeLevel", {
                      required: "Grade level is required",
                    })}
                    placeholder="10"
                  />
                  {errors.gradeLevel && (
                    <span className="error">{errors.gradeLevel.message}</span>
                  )}
                </label>
                <label>
                  Student ID
                  <input
                    {...register("studentId", {
                      required: "Student ID is required",
                    })}
                    placeholder="STU-2045"
                  />
                  {errors.studentId && (
                    <span className="error">{errors.studentId.message}</span>
                  )}
                </label>
              </>
            ) : (
              <>
                <label>
                  Subject focus
                  <input
                    {...register("subject", {
                      required: "Subject focus is required",
                    })}
                    placeholder="Mathematics"
                  />
                  {errors.subject && (
                    <span className="error">{errors.subject.message}</span>
                  )}
                </label>
                <label>
                  Employee ID
                  <input
                    {...register("employeeId", {
                      required: "Employee ID is required",
                    })}
                    placeholder="EMP-8820"
                  />
                  {errors.employeeId && (
                    <span className="error">{errors.employeeId.message}</span>
                  )}
                </label>
              </>
            )}

            <button type="submit" className="primary">
              Add registration
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Registration summary</h2>
          <div className="summary">
            <div>
              <span className="label">Total</span>
              <strong>{summary.total}</strong>
            </div>
            <div>
              <span className="label">Students</span>
              <strong>{summary.studentCount}</strong>
            </div>
            <div>
              <span className="label">Teachers</span>
              <strong>{summary.teacherCount}</strong>
            </div>
          </div>

          <div className="list">
            {registrations.length ? (
              registrations.map((registration) => (
                <article key={registration.id} className="list-item">
                  <div>
                    <h3>{registration.fullName}</h3>
                    <p className="muted">
                      {registration.role === "student"
                        ? `Student • Grade ${registration.gradeLevel}`
                        : `Teacher • ${registration.subject}`}
                    </p>
                  </div>
                  <div className="meta">
                    <span>{registration.email}</span>
                    <span>
                      {registration.role === "student"
                        ? registration.studentId
                        : registration.employeeId}
                    </span>
                    <span>{registration.createdAt}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty">
                <p>Registrations will appear here after you submit the form.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
