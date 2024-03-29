import React, { useState } from 'react';
import ToolsList from './ToolsList';
import TextInput from '../Components/Input/Text';
import Checkbox from '../Components/Input/Checkbox';
import Tools from '../Helper/Tools';

import {useUserTools} from '../context/user-tools-context';
import {useUserGroups} from '../context/user-groups-context';

// Move these into the API helper
const getCheckedGroupsArray = (groupsState) => {
	const onlyChecked = groupsState.filter(each => {
		return each.checked;
	});
	return onlyChecked.map(each => { return  each.data._id });
};

const ToolsSearch = () => {
	const userTools = useUserTools();
	const userGroups = useUserGroups();

	const placeholder = 'Type in a tool name';
	const initialTextInput = '';
	const groupsInitialState = userGroups.map(group => {
		return {
			data: group,
			checked: true
		};
	});

	const [ textInput, setTextInput ] = useState(initialTextInput);
	const [ tools, setTools ] = useState(userTools);
	const [ groups, setGroups ] = useState(groupsInitialState);	

	const handleInputChange = (e) => {
		const newValue = e.target.value;
		setTextInput(newValue);
		setTools(Tools.filterToolsByKeyword(newValue, userTools));
	};
	const handleCheckboxChange = (e) => {
		let nextGroupsState = groups.map(group => {
			let nextGroup = Object.assign({}, group);
			if (group.data._id.toString() === e.target.value) {
				nextGroup.checked = e.target.checked;
			}
			return nextGroup;
		});
		setGroups(nextGroupsState);
		let checkedGroupsArray = getCheckedGroupsArray(nextGroupsState);
		setTools(Tools.filterToolsByGroups(checkedGroupsArray,  userTools)); 
	};
	const handleSubmit = (e) => {
		e.preventDefault();
	};
	const groupsList = groups.map(group => {
		return (
			<li key={group._id}>
				<Checkbox 
					value={group.data._id} 
					text={group.data.name} 
					onChange={handleCheckboxChange}
					checked={group.checked}
				/>
			</li>
		);
	});
	return (
		<div id='tool-search'>
			<p>{JSON.stringify(userTools)}</p>
			<p>{JSON.stringify(userGroups)}</p>
			<form onSubmit={handleSubmit}>
				<TextInput 
					data-testid='search-input'
					id='search' 
					name='search-input' 
					placeholder={placeholder} 
					value={textInput} 
					onChange={handleInputChange} 
					autoFocus={true}
				/>
				<h3>My Groups:</h3>
				<ul>{ groups.length > 0 ? groupsList : <li>No Groups!</li> }</ul>
			</form>
			<div>
				<h3>Search Results:</h3>
				<ul>{ tools.length > 0 ? <ToolsList tools={tools} /> : <li>No Matches!</li> }</ul>
			</div>
		</div>
	);
}

export default ToolsSearch;
