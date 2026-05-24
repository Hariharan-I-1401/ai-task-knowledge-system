from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.user import User
from app.models.task import Task  # Assumes a relational standard Task model exists
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/tasks", tags=["Task Management Management"])

@router.post("", status_code=status.HTTP_201_CREATED)
def create_and_assign_task(
    title: str,
    description: str,
    assigned_to_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    ADMIN GATEWAY: Allows system administrators to deploy tasks to specific user nodes .
    """
    # Protect API endpoint based on authenticated RBAC claims [cite: 145-150]
    if current_user.role.name != "Admin" and current_user.role.name != "Founder":
        raise HTTPException(
            status_code=403, 
            detail="Elevated administrative clearance parameters required to register tasks."
        )

    # Verify target user entity node exists
    target_user = db.query(User).filter(User.id == assigned_to_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Target operator account sequence not found.")

    new_task = Task(
        title=title,
        description=description,
        status="Pending", # Default initialization assignment state [cite: 177]
        assigned_to=assigned_to_id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return {"status": "success", "task_id": new_task.id}


@router.get("")
def retrieve_filtered_tasks(
    status: Optional[str] = Query(None), # Dynamic filtering toggle parameter 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    DYNAMIC FILTERING API: Fetches tasks with conditional parameters [cite: 178-183].
    """
    query = db.query(Task)

    # RBAC logic: Admins view everything, standard users view only their assigned scopes [cite: 170-174]
    if current_user.role.name != "Admin" and current_user.role.name != "Founder":
        query = query.filter(Task.assigned_to == current_user.id) 

    # Apply dynamic filter modifiers on the active SQL compilation stream 
    if status:
        query = query.filter(Task.status == status.capitalize())

    tasks = query.all()
    return [
        {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "status": t.status,
            "assigned_to": t.assigned_to
        }
        for t in tasks
    ]


@router.patch("/{task_id}/status")
def update_task_operational_status(
    task_id: int,
    new_status: str = Query(..., regex="^(Pending|Completed)$"), # Enforces strict string limits [cite: 177, 179]
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    OPERATOR ACCESS GATEWAY: Allows users to mark clear boundaries on assigned items .
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task signature records not found.")

    # Enforce clear data scoping checks
    if current_user.role.name != "Admin" and task.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied: Cannot alter foreign task bounds.")

    task.status = new_status.capitalize()
    db.commit()
    return {"status": "success", "updated_to": task.status}