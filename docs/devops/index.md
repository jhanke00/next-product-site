# DevOps

Documentation on any DevOps changes made.

## **Check PR Label**

### **Overview**

The GitHub Actions workflow checks whether a pull request (PR) includes at least one defined labels. It helps ensure that all PRs are properly categorized.

---

### **Purpose**

To maintain consistency and organization within the project by enforcing the use of specific labels on every pull request. This helps streamline the review process and supports better tracking.

---

### **Trigger**

The workflow is triggered on **`main`** branch onthe following **`pull_request`** events:
- `opened`
- `synchronize`
- `labeled`

---

### **Required Labels**

At least one of the following labels must be present on the PR:
- **DevOps**
- **Infrastructure**
- **Backend**
- **Frontend**


---

### **Implementation**

#### **1. Checkout Code**
- Retrieves the repository code so subsequent steps can be executed.

#### **2. Label Validation**
- Gathers all labels from the PR.
- Checks whether at least one of the required labels is present.

**Result:**
- ✅ If any required label is found: the workflow **passes** with following message: ✅ PR contains a required label.
- ❌ If none are found: the workflow **fails** with an following  error message: ❌ PR must include at least one label: devops, infrastructure, frontend, backend

---

### **Benefits**

- **Encourages consistent labeling** across all contributions.
- **Reduces manual errors** in triaging and categorization.
- **Improves visibility** and filtering in the development workflow.
