import { resumeNodes } from "@/content/profile";

export function ResumeTree() {
  return (
    <ol className="resume-board" aria-label="Patrick 的学习与实务履历">
      {resumeNodes.map((node, index) => (
        <li
          className={`resume-card${node.organization.includes("TikTok") ? " is-featured" : ""}`}
          key={`${node.organization}-${node.period}`}
        >
          <div className="resume-card-topline">
            <span>{node.period}</span>
            <small>{String(index + 1).padStart(2, "0")}</small>
          </div>
          <div className="resume-card-title">
            <h3>{node.organization}</h3>
            <p>{node.role}</p>
          </div>
          <ul className="resume-keywords" aria-label={`${node.organization}关键词`}>
            {node.skills.map((skill) => (
              <li key={skill}><span aria-hidden="true">↗</span>{skill}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
