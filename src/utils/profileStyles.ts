export type ProfileType = 'Design' | 'Engineering' | 'Management' | 'Strategy';

export const getProfileTypeStyles = (profileType: ProfileType) => {
  return {
    border: {
      'Design': 'border-designpurpleborder bg-designpurplebg',
      'Engineering': 'border-engblueborder bg-engbluebg',
      'Management': 'border-manpinkborder bg-manpinkbg',
      'Strategy': 'border-strategygreenborder bg-strategygreenbg'
    }[profileType] || '',
    text: {
      'Design': 'text-designpurple',
      'Engineering': 'text-engblue',
      'Management': 'text-manpink',
      'Strategy': 'text-strategygreen'
    }[profileType] || ''
  };
};
