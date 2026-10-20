const assert = require('node:assert/strict');
const { test } = require('node:test');
const { loadSource, createReactHarness, findElement, icons } = require('./helpers.cjs');
test('project actions retain the correct live URLs and full case-study records', () => {
 const harness = createReactHarness();
 const projects = ['careerwise', 'buildstack', 'tripcraft'].map(id => ({id,title:id,liveUrl:`https://${id}.example`,githubUrl:`https://github.com/example/${id}`,technologies:['TypeScript'],problem:'Original project problem'}));
 const {SelectedWork} = loadSource('components/SelectedWork.tsx', {
 react:harness.React,'next/image':'image','lucide-react':icons,
 '@/data/portfolio':{portfolioData:{projects}},
 '@/lib/projectImages':{projectImages:Object.fromEntries(projects.map(p=>[p.id,{dark:'dark.png',light:'light.png'}]))},
 './ProjectModal':{ProjectModal:'project-modal'},
 '@/hooks/useEditorialMotion':{useEditorialMotion(){}},
 });
 let tree = harness.render(SelectedWork);
 for(const project of projects) assert.ok(findElement(tree,node=>node.type==='a' && node.props.href===project.liveUrl));
 const open = findElement(tree,node=>node.type==='button' && node.props['aria-label']==='Read TripCraft case study');
 open.props.onClick();
 tree = harness.render(SelectedWork);
 let modal = findElement(tree,node=>node.type==='project-modal');
 assert.equal(modal.props.project,projects[2]);
 modal.props.onClose();
 modal = findElement(harness.render(SelectedWork),node=>node.type==='project-modal');
 assert.equal(modal.props.project,null);
});
